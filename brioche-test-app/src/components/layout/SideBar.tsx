import './SideBar.scss';

export type SideBarItem = {
  key: string;
  label: string;
  href: string;
};

type SideBarProps = {
  activeKey: string;
  items: readonly SideBarItem[];
  className?: string;
};

const SideBar = ({ activeKey, items, className }: SideBarProps) => (
  <aside className={`side_bar${className ? ` ${className}` : ''}`}>
    {items.map((item) => (
      <a
        key={item.key}
        className={`side_bar_link${item.key === activeKey ? ' is_active' : ''}`}
        href={item.href}
        aria-current={item.key === activeKey ? 'page' : undefined}
      >
        {item.label}
      </a>
    ))}
  </aside>
);

export default SideBar;
