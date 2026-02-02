import { PostData } from '@/packages/type/postType';
import WriteComment from '../home/comment/WriteComment';
import CommentList from '../home/comment/CommentList';

export type ReadFooterPostProps = {
  type: 'post';
  post: PostData;
  postId: string;
};

export type ReadFooterNoticeProps = {
  type: 'notice';
  noticeId: string;
};

export type ReadFooterProps = ReadFooterPostProps | ReadFooterNoticeProps;

export default function ReadFooter(props: ReadFooterProps) {
  if (props.type === 'post') {
    return (
      <div className="flex flex-col w-full">
        <CommentList
          postId={props.postId}
          postAuthorId={props.post.authorId}
          collectionName="boards"
        />
        <WriteComment postId={props.postId} collectionName="boards" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <CommentList
        postId={props.noticeId}
        collectionName="notice"
      />
      <WriteComment postId={props.noticeId} collectionName="notice" />
    </div>
  );
}
