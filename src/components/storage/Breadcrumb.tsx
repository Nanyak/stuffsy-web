import { ChevronRight, HardDrive } from "lucide-react";

interface BreadcrumbProps {
  path: string[];
  onNavigate: (path: string[]) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-0.5 text-sm flex-wrap">
      <button
        onClick={() => onNavigate([])}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors duration-150 cursor-pointer"
        style={{ color: '#949494' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#F3F3F3')}
        onMouseLeave={e => (e.currentTarget.style.color = '#949494')}
      >
        <HardDrive className="h-4 w-4" />
        <span>My Drive</span>
      </button>
      {path.map((segment, index) => {
        const isLast = index === path.length - 1;
        return (
          <span key={index} className="flex items-center gap-0.5">
            <ChevronRight className="h-4 w-4 shrink-0" style={{ color: '#949494' }} />
            <button
              onClick={() => onNavigate(path.slice(0, index + 1))}
              className={`px-2 py-1 rounded-md transition-colors duration-150 max-w-[180px] truncate ${
                isLast ? "pointer-events-none" : "cursor-pointer"
              }`}
              style={{
                color: isLast ? '#F3F3F3' : '#949494',
                fontWeight: isLast ? 600 : 400,
              }}
              title={segment}
              onMouseEnter={e => !isLast && (e.currentTarget.style.color = '#F3F3F3')}
              onMouseLeave={e => !isLast && (e.currentTarget.style.color = '#949494')}
            >
              {segment}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
