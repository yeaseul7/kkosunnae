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
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <Header visibleHeaderButtons={visibleHeaderButtons} />
      </div>
      {visibleHomeTab && <HomeTab />}
      <div className="w-full">{children}</div>
    </div>
  );
}
