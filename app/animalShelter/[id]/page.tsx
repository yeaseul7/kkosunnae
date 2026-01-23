import { Metadata } from 'next';
import PageTemplate from "@/packages/ui/components/base/PageTemplate";
import { ShelterInfoItem } from '@/packages/type/shelterTyps';
import { ShelterAnimalItem } from '@/packages/type/postType';
import ShelterInfoComponent from "@/packages/ui/components/home/shelterList/ShelterInfoComponent";

interface AnimalShelterPageProps {
    params: Promise<{ id: string }>;
}

const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3001';

async function fetchShelterInfo(careRegNo: string): Promise<ShelterInfoItem | null> {
    try {
        const response = await fetch(`${baseUrl}/api/shelter-info?care_reg_no=${careRegNo}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (data?.response?.body?.items?.item) {
            const items = Array.isArray(data.response.body.items.item)
                ? data.response.body.items.item
                : [data.response.body.items.item];
            return items.length > 0 ? items[0] : null;
        }
        return null;
    } catch (err) {
        console.error('보호소 정보 조회 오류:', err);
        return null;
    }
}

async function fetchShelterAnimals(careRegNo: string): Promise<ShelterAnimalItem[]> {
    try {
        const response = await fetch(`${baseUrl}/api/shelter-data?care_reg_no=${careRegNo}&numOfRows=1000`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        if (data?.response?.body?.items?.item) {
            const items = Array.isArray(data.response.body.items.item)
                ? data.response.body.items.item
                : [data.response.body.items.item];
            return items;
        }
        return [];
    } catch (err) {
        console.error('유기동물 정보 조회 오류:', err);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    try {
        const shelter = await fetchShelterInfo(id);

        if (shelter) {
            const shelterName = shelter.careNm || '보호소';
            const title = `${shelterName} | 꼬순내`;

            let description = '';
            if (shelter.careAddr) {
                description = `${shelterName} - ${shelter.careAddr}. 입양 대기 중인 친구들을 만나보세요.`;
            } else {
                description = `${shelterName}에서 입양 대기 중인 친구들을 만나보세요.`;
            }

            const defaultImageUrl = `${baseUrl}/static/images/defaultDogImg.png`;
            const pageUrl = `${baseUrl}/animalShelter/${id}`;

            return {
                title,
                description,
                metadataBase: new URL(baseUrl),
                alternates: {
                    canonical: pageUrl,
                },
                openGraph: {
                    title,
                    description,
                    url: pageUrl,
                    siteName: '꼬순내',
                    images: [
                        {
                            url: defaultImageUrl,
                            width: 1200,
                            height: 630,
                            alt: shelterName,
                            type: 'image/jpeg',
                        },
                    ],
                    locale: 'ko_KR',
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [defaultImageUrl],
                    creator: '@kkosunnae',
                    site: '@kkosunnae',
                },
            };
        }
    } catch (error) {
        console.error('메타데이터 생성 중 오류:', error);
    }

    const defaultImageUrl = `${baseUrl}/static/images/defaultDogImg.png`;

    return {
        title: '보호소 정보 | 꼬순내',
        description: '보호소 정보 및 입양 대기 중인 친구들을 확인해보세요.',
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: '보호소 정보 | 꼬순내',
            description: '보호소 정보 및 입양 대기 중인 친구들을 확인해보세요.',
            url: `${baseUrl}/animalShelter/${id}`,
            siteName: '꼬순내',
            images: [
                {
                    url: defaultImageUrl,
                    width: 1200,
                    height: 630,
                    alt: '꼬순내',
                },
            ],
            locale: 'ko_KR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: '보호소 정보 | 꼬순내',
            description: '보호소 정보 및 입양 대기 중인 친구들을 확인해보세요.',
            images: [defaultImageUrl],
        },
    };
}

export default async function AnimalShelterPage({ params }: AnimalShelterPageProps) {
    const { id } = await params;

    // 서버에서 데이터 가져오기
    const [shelter, animals] = await Promise.all([
        fetchShelterInfo(id),
        fetchShelterAnimals(id),
    ]);

    return (
        <div className="w-full min-h-screen font-sans bg-white">
            <main className="flex flex-col justify-between items-center w-full min-h-screen bg-whitesm:items-start">
                <PageTemplate visibleHomeTab={false}>
                    <ShelterInfoComponent shelter={shelter} animals={animals} />
                </PageTemplate>
            </main>
        </div>
    );
}