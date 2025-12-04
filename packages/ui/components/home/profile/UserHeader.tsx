'use client';
import { useAuth } from '@/lib/firebase/auth';
import { firestore } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { handleImageUpload } from '@/lib/tiptap-utils';
import EditingHeader from './EditingHeader';
import EditingHeaderText from './EditingHeaderText';
import EditingBtn from './EditingBtn';
import ReadHeaderText from './ReadHeaderText';
import ReasHeaderImg from './ReasHeaderImg';

interface ProfileUser {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
}

export default function UserHeader() {
  const params = useParams();
  const userId = params.id as string;
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedPhotoURL, setEditedPhotoURL] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = user?.uid === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileUser({
            uid: userId,
            displayName: userData?.nickname || userData?.displayName || '',
            photoURL: userData?.photoURL || null,
            email: userData?.email || '',
          });
          setDescription(userData?.description || '');
          setEditedName(userData?.nickname || userData?.displayName || '');
          setEditedDescription(userData?.description || '');
          setEditedPhotoURL(userData?.photoURL || null);
        }
      } catch (error) {
        console.error('사용자 프로필 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      setEditedPhotoURL(imageUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setEditedPhotoURL(null);
  };

  const handleSave = async () => {
    if (!isOwnProfile || !user || !userId) return;
    if (!editedName.trim()) {
      alert('이름은 필수입니다.');
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        nickname: editedName.trim(),
        description: editedDescription.trim() || '',
        photoURL: editedPhotoURL,
        updatedAt: serverTimestamp(),
      });

      await updateProfile(user, {
        displayName: editedName.trim(),
        photoURL: editedPhotoURL || null,
      });

      if (profileUser) {
        setProfileUser({
          ...profileUser,
          displayName: editedName.trim(),
          photoURL: editedPhotoURL,
        });
      }
      setDescription(editedDescription.trim());

      setIsEditing(false);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(profileUser?.displayName || '');
    setEditedDescription(description);
    setEditedPhotoURL(profileUser?.photoURL || null);
    setIsEditing(false);
  };

  // 편집 모드일 때는 editedPhotoURL을 직접 사용 (null이면 이미지 없음)
  // 편집 모드가 아닐 때는 profileUser의 photoURL 사용
  const currentPhotoURL = isEditing ? editedPhotoURL : profileUser?.photoURL;
  const currentName = isEditing ? editedName : profileUser?.displayName || '';
  const currentDescription = isEditing ? editedDescription : description;

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-16 mb-4 w-full">
        <div className="text-gray-500">프로필을 불러오는 중...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center mt-16 mb-4 w-full">
        <div className="text-gray-500">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-16 mb-4 w-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-4 justify-start items-center w-full">
            {isEditing ? (
              <EditingHeader
                currentPhotoURL={currentPhotoURL ?? null}
                currentName={currentName}
                fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                handleImageChange={handleImageChange}
                handleImageRemove={handleImageRemove}
                isUploading={isUploading}
              />
            ) : (
              <ReasHeaderImg
                currentPhotoURL={currentPhotoURL || ''}
                currentName={currentName}
              />
            )}

            <div className="flex flex-col gap-2 w-full">
              {isEditing ? (
                <EditingHeaderText
                  editedName={editedName}
                  setEditedName={setEditedName}
                  editedDescription={editedDescription}
                  setEditedDescription={setEditedDescription}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  isSaving={isSaving}
                  isUploading={isUploading}
                  isOwnProfile={isOwnProfile}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              ) : (
                <ReadHeaderText
                  currentName={currentName}
                  currentDescription={currentDescription}
                />
              )}
            </div>
          </div>
          <EditingBtn
            handleSave={handleSave}
            handleCancel={handleCancel}
            isSaving={isSaving}
            isUploading={isUploading}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </div>
  );
}
