import HomeTab from '../home/HomeTab';
import Header from './Header';

interface PageTemplateProps {
  children?: React.ReactNode;
  visibleHomeTab?: boolean;
  visibleHeaderButtons?: boolean;
}

export default function PageTemplate({
  children,
  visibleHomeTab = true,
  visibleHeaderButtons = true,
}: PageTemplateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Header visibleHeaderButtons={visibleHeaderButtons} />
      {visibleHomeTab && <HomeTab />}
      {children}
    </div>
  );
}
