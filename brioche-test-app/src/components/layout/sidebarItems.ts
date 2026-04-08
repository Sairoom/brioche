import { SideBarItem } from './SideBar';

export const sideBarItems = [
  { key: 'history', label: 'История проекта', href: '/project-history' },
  { key: 'shop', label: 'О магазине', href: '/about-shop' },
  { key: 'order', label: 'Как заказать', href: '/how-to-order' },
  { key: 'delivery', label: 'Доставка', href: '/delivery' },
  { key: 'payment', label: 'Оплата', href: '/payment' },
  { key: 'contacts', label: 'Контакты', href: '/contacts' },
] as const satisfies readonly SideBarItem[];
