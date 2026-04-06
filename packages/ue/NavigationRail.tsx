import React from 'react';

export interface NavDestination {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface NavigationRailProps {
  activeId?: string;
  activeDrawerItemId?: string;
  onSelect?: (id: string, drawerItemId?: string) => void;
  onFabClick?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeId = 'benefits',
  activeDrawerItemId,
  onSelect,
  onFabClick
}) => {
  const [selectedHiringDrawerItem, setSelectedHiringDrawerItem] = React.useState('overview');
  const [isHiringHelpExpanded, setIsHiringHelpExpanded] = React.useState(false);

  const [selectedGrowthDrawerItem, setSelectedGrowthDrawerItem] = React.useState('overview');
  const [isGrowthHelpExpanded, setIsGrowthHelpExpanded] = React.useState(false);
  const [isGrowthWorkplaceExpanded, setIsGrowthWorkplaceExpanded] = React.useState(false);

  const [selectedPerfDrawerItem, setSelectedPerfDrawerItem] = React.useState('overview');
  const [isPerfHelpExpanded, setIsPerfHelpExpanded] = React.useState(false);

  const [selectedCompDrawerItem, setSelectedCompDrawerItem] = React.useState('overview');
  const [isCompHelpExpanded, setIsCompHelpExpanded] = React.useState(false);

  const [selectedBenefitsDrawerItem, setSelectedBenefitsDrawerItem] = React.useState('overview');
  const [isBenefitsHelpExpanded, setIsBenefitsHelpExpanded] = React.useState(false);

  const [selectedCultureDrawerItem, setSelectedCultureDrawerItem] = React.useState('culture');
  const [isCultureHelpExpanded, setIsCultureHelpExpanded] = React.useState(false);

  const [selectedHelpDrawerItem, setSelectedHelpDrawerItem] = React.useState('support');
  const [isAdditionalHelpExpanded, setIsAdditionalHelpExpanded] = React.useState(false);
  const [isHelpCultureExpanded, setIsHelpCultureExpanded] = React.useState(false);
  const [isHelpEngageExpanded, setIsHelpEngageExpanded] = React.useState(false);

  const [openDrawerId, setOpenDrawerId] = React.useState<string | null>(null);

  const currentHiringSelection = activeDrawerItemId || selectedHiringDrawerItem;
  const currentGrowthSelection = activeDrawerItemId || selectedGrowthDrawerItem;
  const currentPerfSelection = activeDrawerItemId || selectedPerfDrawerItem;
  const currentCompSelection = activeDrawerItemId || selectedCompDrawerItem;
  const currentBenefitsSelection = activeDrawerItemId || selectedBenefitsDrawerItem;
  const currentCultureSelection = activeDrawerItemId || selectedCultureDrawerItem;
  const currentHelpSelection = activeDrawerItemId || selectedHelpDrawerItem;

  const topDestinations: NavDestination[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_1110)">
            <path d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z" fill="#004A77"/>
          </g>
          <defs>
            <clipPath id="clip0_10784_1110">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'new-chat',
      label: 'New chat',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_3563)">
            <path d="M2 22V4C2 3.45 2.19167 2.98333 2.575 2.6C2.975 2.2 3.45 2 4 2H12C12 2.3 12 2.61667 12 2.95C12 3.28333 12 3.63333 12 4H4V17.125L5.15 16H20V12C20.3667 12 20.7167 12 21.05 12C21.3833 12 21.7 12 22 12V16C22 16.55 21.8 17.025 21.4 17.425C21.0167 17.8083 20.55 18 20 18H6L2 22ZM18.5 10C18.4 10 18.3333 9.95 18.3 9.85C18.0333 8.83333 17.525 7.95833 16.775 7.225C16.0417 6.475 15.1667 5.96667 14.15 5.7C14.05 5.66667 14 5.6 14 5.5C14 5.38333 14.05 5.31667 14.15 5.3C15.1667 5.03333 16.0417 4.53333 16.775 3.8C17.525 3.05 18.0333 2.16667 18.3 1.15C18.3333 1.05 18.4 0.999999 18.5 0.999999C18.6167 0.999999 18.6833 1.05 18.7 1.15C18.9833 2.16667 19.4917 3.05 20.225 3.8C20.9583 4.53333 21.8333 5.03333 22.85 5.3C22.95 5.31667 23 5.38333 23 5.5C23 5.6 22.95 5.66667 22.85 5.7C21.8333 5.96667 20.95 6.475 20.2 7.225C19.4667 7.95833 18.9667 8.83333 18.7 9.85C18.6833 9.95 18.6167 10 18.5 10ZM4 16V4C4 4.23333 4 4.475 4 4.725C4 4.975 4 5.23333 4 5.5C4 7.31667 4 8.85833 4 10.125C4 11.375 4 12 4 12C4 12 4 11.9917 4 11.975C4 11.9417 4 11.8917 4 11.825V16Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_3563">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_4174)">
            <path d="M12 21C9.7 21 7.69167 20.2417 5.975 18.725C4.275 17.1917 3.3 15.2833 3.05 13H5.1C5.33333 14.7333 6.1 16.1667 7.4 17.3C8.71667 18.4333 10.25 19 12 19C13.95 19 15.6 18.325 16.95 16.975C18.3167 15.6083 19 13.95 19 12C19 10.05 18.3167 8.4 16.95 7.05C15.6 5.68333 13.95 5 12 5C10.85 5 9.775 5.26667 8.775 5.8C7.775 6.33333 6.93333 7.06667 6.25 8H9V10H3V4H5V6.35C5.85 5.28333 6.88333 4.45833 8.1 3.875C9.33333 3.29167 10.6333 3 12 3C13.25 3 14.4167 3.24167 15.5 3.725C16.6 4.19167 17.55 4.83333 18.35 5.65C19.1667 6.45 19.8083 7.4 20.275 8.5C20.7583 9.58333 21 10.75 21 12C21 13.25 20.7583 14.425 20.275 15.525C19.8083 16.6083 19.1667 17.5583 18.35 18.375C17.55 19.175 16.6 19.8167 15.5 20.3C14.4167 20.7667 13.25 21 12 21ZM14.8 16.2L11 12.4V7H13V11.6L16.2 14.8L14.8 16.2Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_4174">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'growth',
      label: 'Growth',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2810)">
            <path d="M8.55 20H15.45L16.45 16H7.55L8.55 20ZM8.55 22C8.08333 22 7.675 21.8583 7.325 21.575C6.975 21.2917 6.74167 20.925 6.625 20.475L5.5 16H18.5L17.375 20.475C17.2583 20.925 17.025 21.2917 16.675 21.575C16.325 21.8583 15.9167 22 15.45 22H8.55ZM5 14H19V12H5V14ZM12 8C12 6.33333 12.5833 4.91667 13.75 3.75C14.9167 2.58333 16.3333 2 18 2C18 3.5 17.525 4.8 16.575 5.9C15.625 7 14.4333 7.66667 13 7.9V10H21V14C21 14.55 20.8 15.025 20.4 15.425C20.0167 15.8083 19.55 16 19 16H5C4.45 16 3.975 15.8083 3.575 15.425C3.19167 15.025 3 14.55 3 14V10H11V7.9C9.56667 7.66667 8.375 7 7.425 5.9C6.475 4.8 6 3.5 6 2C7.66667 2 9.08333 2.58333 10.25 3.75C11.4167 4.91667 12 6.33333 12 8Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_2810">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_4180)">
            <path d="M3.4 18L2 16.6L9.4 9.15L13.4 13.15L18.6 8H16V6H22V12H20V9.4L13.4 16L9.4 12L3.4 18Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_4180">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'compensation',
      label: 'Compensation',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_3023)">
            <path d="M11.1 19H12.85V17.75C13.6833 17.6 14.4 17.275 15 16.775C15.6 16.275 15.9 15.5333 15.9 14.55C15.9 13.85 15.7 13.2083 15.3 12.625C14.9 12.0417 14.1 11.5333 12.9 11.1C11.9 10.7667 11.2083 10.475 10.825 10.225C10.4417 9.975 10.25 9.63333 10.25 9.2C10.25 8.76667 10.4 8.425 10.7 8.175C11.0167 7.925 11.4667 7.8 12.05 7.8C12.5833 7.8 13 7.93333 13.3 8.2C13.6 8.45 13.8167 8.76667 13.95 9.15L15.55 8.5C15.3667 7.91667 15.025 7.40833 14.525 6.975C14.0417 6.54167 13.5 6.3 12.9 6.25V5H11.15V6.25C10.3167 6.43333 9.66667 6.8 9.2 7.35C8.73333 7.9 8.5 8.51667 8.5 9.2C8.5 9.98333 8.725 10.6167 9.175 11.1C9.64167 11.5833 10.3667 12 11.35 12.35C12.4 12.7333 13.125 13.075 13.525 13.375C13.9417 13.675 14.15 14.0667 14.15 14.55C14.15 15.1 13.95 15.5083 13.55 15.775C13.1667 16.025 12.7 16.15 12.15 16.15C11.6 16.15 11.1083 15.9833 10.675 15.65C10.2583 15.3 9.95 14.7833 9.75 14.1L8.1 14.75C8.33333 15.55 8.69167 16.2 9.175 16.7C9.675 17.1833 10.3167 17.5167 11.1 17.7V19ZM12 22C10.6167 22 9.31667 21.7417 8.1 21.225C6.88333 20.6917 5.825 19.975 4.925 19.075C4.025 18.175 3.30833 17.1167 2.775 15.9C2.25833 14.6833 2 13.3833 2 12C2 10.6167 2.25833 9.31667 2.775 8.1C3.30833 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31667 8.1 2.8C9.31667 2.26667 10.6167 2 12 2C13.3833 2 14.6833 2.26667 15.9 2.8C17.1167 3.31667 18.175 4.025 19.075 4.925C19.975 5.825 20.6833 6.88333 21.2 8.1C21.7333 9.31667 22 10.6167 22 12C22 13.3833 21.7333 14.6833 21.2 15.9C20.6833 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6917 15.9 21.225C14.6833 21.7417 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_3023">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: (
        <svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M10 12.5C11.05 12.5 11.9833 12.175 12.8 11.525C13.6167 10.875 14.1417 10.0333 14.375 9H12.3C12.1 9.45 11.7917 9.81667 11.375 10.1C10.9583 10.3667 10.5 10.5 10 10.5C9.5 10.5 9.04167 10.3667 8.625 10.1C8.20833 9.81667 7.9 9.45 7.7 9H5.625C5.85833 10.0333 6.38333 10.875 7.2 11.525C8.01667 12.175 8.95 12.5 10 12.5ZM7.25 7.5C7.6 7.5 7.89167 7.38333 8.125 7.15C8.375 6.9 8.5 6.6 8.5 6.25C8.5 5.9 8.375 5.60833 8.125 5.375C7.89167 5.125 7.6 5 7.25 5C6.9 5 6.6 5.125 6.35 5.375C6.11667 5.60833 6 5.9 6 6.25C6 6.6 6.11667 6.9 6.35 7.15C6.6 7.38333 6.9 7.5 7.25 7.5ZM12.75 7.5C13.1 7.5 13.3917 7.38333 13.625 7.15C13.875 6.9 14 6.6 14 6.25C14 5.9 13.875 5.60833 13.625 5.375C13.3917 5.125 13.1 5 12.75 5C12.4 5 12.1 5.125 11.85 5.375C11.6167 5.60833 11.5 5.9 11.5 6.25C11.5 6.6 11.6167 6.9 11.85 7.15C12.1 7.38333 12.4 7.5 12.75 7.5ZM10 18L8.55 16.75C6.86667 15.2833 5.475 14.0167 4.375 12.95C3.275 11.8833 2.4 10.925 1.75 10.075C1.1 9.225 0.641667 8.44167 0.375 7.725C0.125 7.00833 5.96046e-08 6.26667 5.96046e-08 5.5C5.96046e-08 3.93333 0.525 2.625 1.575 1.575C2.625 0.524999 3.93333 -1.43051e-06 5.5 -1.43051e-06C6.36667 -1.43051e-06 7.19167 0.183332 7.975 0.549999C8.75833 0.916666 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916666 12.025 0.549999C12.8083 0.183332 13.6333 -1.43051e-06 14.5 -1.43051e-06C16.0667 -1.43051e-06 17.375 0.524999 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8667 7.00833 19.6 7.725C19.35 8.44167 18.9 9.225 18.25 10.075C17.6 10.925 16.725 11.8833 15.625 12.95C14.525 14.0167 13.1333 15.2833 11.45 16.75L10 18ZM10 15.3C11.6 13.9167 12.9167 12.7417 13.95 11.775C14.9833 10.8083 15.8 9.95833 16.4 9.225C17 8.475 17.4167 7.81667 17.65 7.25C17.8833 6.66667 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.225 12.325 2.675C11.6583 3.10833 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10833 7.675 2.675C7.00833 2.225 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.66667 2.35 7.25C2.58333 7.81667 3 8.475 3.6 9.225C4.2 9.95833 5.01667 10.8083 6.05 11.775C7.08333 12.7417 8.4 13.9167 10 15.3Z" fill="#444746" />
        </svg>
      )
    },
    {
      id: 'hiring',
      label: 'Hiring',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_3033)">
            <path d="M18 14V11H15V9H18V6H20V9H23V11H20V14H18ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM1 20V17.2C1 16.6333 1.14167 16.1167 1.425 15.65C1.725 15.1667 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.65 5.75 13.4C6.81667 13.1333 7.9 13 9 13C10.1 13 11.1833 13.1333 12.25 13.4C13.3167 13.65 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2667 15.1667 16.55 15.65C16.85 16.1167 17 16.6333 17 17.2V20H1ZM3 18H15V17.2C15 17.0167 14.95 16.85 14.85 16.7C14.7667 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5667 11.775 15.35C10.8583 15.1167 9.93333 15 9 15C8.06667 15 7.14167 15.1167 6.225 15.35C5.30833 15.5667 4.4 15.9 3.5 16.35C3.35 16.4333 3.225 16.55 3.125 16.7C3.04167 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.0167 9.80833 10.4 9.425C10.8 9.025 11 8.55 11 8C11 7.45 10.8 6.98333 10.4 6.6C10.0167 6.2 9.55 6 9 6C8.45 6 7.975 6.2 7.575 6.6C7.19167 6.98333 7 7.45 7 8C7 8.55 7.19167 9.025 7.575 9.425C7.975 9.80833 8.45 10 9 10Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_3033">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'culture',
      label: 'Culture',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2921)">
            <path d="M4 19C3.45 19 2.975 18.8083 2.575 18.425C2.19167 18.025 2 17.55 2 17V16C2 14.9 2.25833 13.8667 2.775 12.9C3.30833 11.9167 4.025 11.0667 4.925 10.35C5.825 9.61667 6.88333 9.04167 8.1 8.625C9.31667 8.20833 10.6167 8 12 8C13.3833 8 14.6833 8.20833 15.9 8.625C17.1167 9.04167 18.175 9.61667 19.075 10.35C19.975 11.0667 20.6833 11.9167 21.2 12.9C21.7333 13.8667 22 14.9 22 16V17C22 17.55 21.8 18.025 21.4 18.425C21.0167 18.8083 20.55 19 20 19H4ZM4 17H8C8 15.7333 8.10833 14.525 8.325 13.375C8.55833 12.2083 8.88333 11.2 9.3 10.35C7.7 10.7833 6.41667 11.5167 5.45 12.55C4.48333 13.5667 4 14.7167 4 16V17ZM10 17H14C14 14.8333 13.7417 13.1667 13.225 12C12.7083 10.8167 12.3 10.15 12 10C11.7 10.15 11.2917 10.8167 10.775 12C10.2583 13.1667 10 14.8333 10 17ZM16 17H20V16C20 14.7167 19.5167 13.5667 18.55 12.55C17.5833 11.5167 16.3 10.7833 14.7 10.35C15.1167 11.2 15.4333 12.2083 15.65 13.375C15.8833 14.525 16 15.7333 16 17ZM4.5 7.5C4.08333 7.5 3.725 7.35833 3.425 7.075C3.14167 6.775 3 6.41667 3 6C3 5.58333 3.14167 5.23333 3.425 4.95C3.725 4.65 4.08333 4.5 4.5 4.5C5.08333 4.5 5.95 4.625 7.1 4.875C8.26667 5.10833 9.06667 5.325 9.5 5.525C9.68333 5.60833 9.80833 5.69167 9.875 5.775C9.95833 5.84167 10 5.91667 10 6C10 6.08333 9.83333 6.24167 9.5 6.475C9.06667 6.675 8.26667 6.9 7.1 7.15C5.95 7.38333 5.08333 7.5 4.5 7.5ZM19.5 7.5C18.9167 7.5 18.0417 7.38333 16.875 7.15C15.725 6.91667 14.9333 6.69167 14.5 6.475C14.3167 6.39167 14.1833 6.31667 14.1 6.25C14.0333 6.16667 14 6.08333 14 6C14 5.93333 14.1667 5.775 14.5 5.525C14.9333 5.30833 15.725 5.08333 16.875 4.85C18.0417 4.61667 18.9167 4.5 19.5 4.5C19.9167 4.5 20.2667 4.65 20.55 4.95C20.85 5.23333 21 5.58333 21 6C21 6.41667 20.85 6.775 20.55 7.075C20.2667 7.35833 19.9167 7.5 19.5 7.5ZM12 7C11.7167 7 11.475 6.90833 11.275 6.725C11.0917 6.525 11 6.28333 11 6C11 5.71667 11.0917 5.48333 11.275 5.3C11.475 5.1 11.7167 5 12 5C12.2833 5 12.5167 5.1 12.7 5.3C12.9 5.48333 13 5.71667 13 6C13 6.28333 12.9 6.525 12.7 6.725C12.5167 6.90833 12.2833 7 12 7ZM8 17H4C4 17 4.425 17 5.275 17C6.14167 17 7.05 17 8 17ZM16 17C16.95 17 17.85 17 18.7 17C19.5667 17 20 17 20 17H16Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_2921">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'help-center',
      label: 'Help center',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_3063)">
            <path d="M12 18C12.35 18 12.6417 17.8833 12.875 17.65C13.125 17.4 13.25 17.1 13.25 16.75C13.25 16.4 13.125 16.1083 12.875 15.875C12.6417 15.625 12.35 15.5 12 15.5C11.65 15.5 11.35 15.625 11.1 15.875C10.8667 16.1083 10.75 16.4 10.75 16.75C10.75 17.1 10.8667 17.4 11.1 17.65C11.35 17.8833 11.65 18 12 18ZM11.1 14.15H12.95C12.95 13.55 13.0167 13.1083 13.15 12.825C13.2833 12.5417 13.5667 12.1833 14 11.75C14.5833 11.1667 14.9917 10.6833 15.225 10.3C15.475 9.9 15.6 9.45 15.6 8.95C15.6 8.06667 15.3 7.35833 14.7 6.825C14.1 6.275 13.2917 6 12.275 6C11.3583 6 10.575 6.225 9.925 6.675C9.29167 7.125 8.85 7.75 8.6 8.55L10.25 9.2C10.3667 8.75 10.6 8.39167 10.95 8.125C11.3 7.84167 11.7083 7.7 12.175 7.7C12.625 7.7 13 7.825 13.3 8.075C13.6 8.30833 13.75 8.625 13.75 9.025C13.75 9.30833 13.6583 9.60833 13.475 9.925C13.2917 10.2417 12.9833 10.5917 12.55 10.975C12 11.4583 11.6167 11.925 11.4 12.375C11.2 12.8083 11.1 13.4 11.1 14.15ZM5 21C4.45 21 3.975 20.8083 3.575 20.425C3.19167 20.025 3 19.55 3 19V5C3 4.45 3.19167 3.98333 3.575 3.6C3.975 3.2 4.45 3 5 3H19C19.55 3 20.0167 3.2 20.4 3.6C20.8 3.98333 21 4.45 21 5V19C21 19.55 20.8 20.025 20.4 20.425C20.0167 20.8083 19.55 21 19 21H5ZM5 19H19V5H5V19ZM5 5V19V5Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_3063">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2901)">
            <path d="M5.85 17.1C6.7 16.45 7.65 15.9417 8.7 15.575C9.75 15.1917 10.85 15 12 15C13.15 15 14.25 15.1917 15.3 15.575C16.35 15.9417 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1833 15.6417 19.5 14.775C19.8333 13.9083 20 12.9833 20 12C20 9.78333 19.2167 7.9 17.65 6.35C16.1 4.78333 14.2167 4 12 4C9.78333 4 7.89167 4.78333 6.325 6.35C4.775 7.9 4 9.78333 4 12C4 12.9833 4.15833 13.9083 4.475 14.775C4.80833 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1833 12.6667 9.5 12C8.83333 11.3167 8.5 10.4833 8.5 9.5C8.5 8.51667 8.83333 7.69167 9.5 7.025C10.1833 6.34167 11.0167 6 12 6C12.9833 6 13.8083 6.34167 14.475 7.025C15.1583 7.69167 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1583 11.3167 14.475 12C13.8083 12.6667 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7417 8.1 21.225C6.88333 20.6917 5.825 19.975 4.925 19.075C4.025 18.175 3.30833 17.1167 2.775 15.9C2.25833 14.6833 2 13.3833 2 12C2 10.6167 2.25833 9.31667 2.775 8.1C3.30833 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31667 8.1 2.8C9.31667 2.26667 10.6167 2 12 2C13.3833 2 14.6833 2.26667 15.9 2.8C17.1167 3.31667 18.175 4.025 19.075 4.925C19.975 5.825 20.6833 6.88333 21.2 8.1C21.7333 9.31667 22 10.6167 22 12C22 13.3833 21.7333 14.6833 21.2 15.9C20.6833 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6917 15.9 21.225C14.6833 21.7417 13.3833 22 12 22Z" fill="#444746" />
          </g>
          <defs>
            <clipPath id="clip0_10784_2901">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="w-[96px] h-full bg-[#F8FAFD] flex flex-col items-center py-4 font-google-sans relative z-20" id="cee-navigation-rail">
      {/* Top Section: FAB + Destinations */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* FAB */}
        <button
          onClick={onFabClick}
          className="w-14 h-14 bg-[#D3E3FD] rounded-[16px] flex items-center justify-center hover:shadow-elevation-2 transition-shadow"
          id="fab-button"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
            <path d="M11.775 22C11.175 22 10.6333 21.7917 10.15 21.375C9.68333 20.9583 9.425 20.45 9.375 19.85C8.775 19.75 8.29167 19.5167 7.925 19.15C7.55833 18.7833 7.325 18.3 7.225 17.7C6.69167 17.65 6.225 17.4333 5.825 17.05C5.44167 16.65 5.225 16.1833 5.175 15.65C4.54167 15.6 4.025 15.3417 3.625 14.875C3.225 14.3917 3.025 13.8333 3.025 13.2C3.025 12.9 3.075 12.5917 3.175 12.275C3.29167 11.9417 3.475 11.65 3.725 11.4L9.525 5.6L12.775 8.85C12.825 8.9 12.875 8.94167 12.925 8.975C12.975 8.99167 13.0417 9 13.125 9C13.275 9 13.3917 8.95833 13.475 8.875C13.575 8.775 13.625 8.65 13.625 8.5C13.625 8.41667 13.6083 8.35 13.575 8.3C13.5583 8.25 13.525 8.2 13.475 8.15L10.65 5.325C10.2167 4.89167 9.725 4.56667 9.175 4.35C8.64167 4.11667 8.075 4 7.475 4C6.225 4 5.15833 4.44167 4.275 5.325C3.40833 6.19167 2.975 7.25 2.975 8.5C2.975 8.83333 3.00833 9.14167 3.075 9.425C3.14167 9.70833 3.24167 10 3.375 10.3L1.875 11.8C1.575 11.3 1.35 10.775 1.2 10.225C1.05 9.675 0.975 9.1 0.975 8.5C0.975 6.68333 1.6 5.15 2.85 3.9C4.11667 2.63333 5.65833 2 7.475 2C8.225 2 8.95833 2.13333 9.675 2.4C10.3917 2.65 11.0417 3.01667 11.625 3.5C12.2583 3 12.95 2.625 13.7 2.375C14.45 2.125 15.225 2 16.025 2C17.975 2 19.625 2.68333 20.975 4.05C22.3417 5.4 23.025 7.05 23.025 9C23.025 9.93333 22.8333 10.8333 22.45 11.7C22.0833 12.55 21.575 13.3 20.925 13.95L13.575 21.3C13.3417 21.5333 13.0667 21.7083 12.75 21.825C12.4333 21.9417 12.1083 22 11.775 22ZM12.225 19.85L19.525 12.55C20.0083 12.0667 20.375 11.525 20.625 10.925C20.8917 10.325 21.025 9.68333 21.025 9C21.025 7.61667 20.5333 6.44167 19.55 5.475C18.5833 4.49167 17.4083 4 16.025 4C15.4917 4 14.9833 4.075 14.5 4.225C14.0167 4.375 13.5583 4.6 13.125 4.9L14.925 6.7C15.1583 6.93333 15.3333 7.20833 15.45 7.525C15.5667 7.84167 15.625 8.16667 15.625 8.5C15.625 9.18333 15.3833 9.76667 14.9 10.25C14.4333 10.7167 13.8583 10.95 13.175 10.95C12.8417 10.95 12.5167 10.8917 12.2 10.775C11.8833 10.6583 11.6083 10.4833 11.375 10.25L9.575 8.45L5.175 12.85C5.125 12.9 5.08333 12.9583 5.05 13.025C5.03333 13.0917 5.025 13.1667 5.025 13.25C5.025 13.3833 5.06667 13.4917 5.15 13.575C5.23333 13.6583 5.34167 13.7 5.475 13.7C5.55833 13.7 5.63333 13.6917 5.7 13.675C5.76667 13.6417 5.825 13.6 5.875 13.55L9.275 10.15L10.675 11.55L7.275 14.95C7.225 15 7.18333 15.0583 7.15 15.125C7.13333 15.1917 7.125 15.2667 7.125 15.35C7.125 15.4833 7.16667 15.5917 7.25 15.675C7.33333 15.7583 7.44167 15.8 7.575 15.8C7.65833 15.8 7.73333 15.7917 7.8 15.775C7.86667 15.7417 7.925 15.7 7.975 15.65L11.375 12.25L12.775 13.65L9.375 17.05C9.325 17.1 9.28333 17.1667 9.25 17.25C9.21667 17.3167 9.2 17.3917 9.2 17.475C9.2 17.6083 9.24167 17.7167 9.325 17.8C9.40833 17.8833 9.51667 17.925 9.65 17.925C9.73333 17.925 9.80833 17.9083 9.875 17.875C9.95833 17.8417 10.025 17.8 10.075 17.75L13.475 14.35L14.875 15.75L11.475 19.15C11.425 19.2 11.3833 19.2583 11.35 19.325C11.3333 19.3917 11.325 19.4667 11.325 19.55C11.325 19.6833 11.3667 19.7917 11.45 19.875C11.5333 19.9583 11.6417 20 11.775 20C11.8583 20 11.9417 19.9917 12.025 19.975C12.1083 19.9417 12.175 19.9 12.225 19.85Z" fill="#0842A0" />
          </svg>
        </button>

        {/* Destinations */}
        <div className="flex flex-col gap-1 w-full">
          {topDestinations.map((dest, index) => {
            const isActive = activeId === dest.id;
            return (
              <React.Fragment key={dest.id}>
                {/* Inset Divider before Growth (Nav item 20) */}
                {dest.id === 'growth' && (
                  <div className="w-full flex justify-center my-1">
                    <div className="w-16 h-[1px] bg-[#C4C7C5]"></div>
                  </div>
                )}

                <button
                  onClick={() => {
                    const wasActive = activeId === dest.id;
                    setOpenDrawerId(dest.id);

                    if (!wasActive) {
                      if (dest.id === 'growth') setSelectedGrowthDrawerItem('overview');
                      else if (dest.id === 'performance') setSelectedPerfDrawerItem('overview');
                      else if (dest.id === 'compensation') setSelectedCompDrawerItem('overview');
                      else if (dest.id === 'hiring') setSelectedHiringDrawerItem('overview');
                      else if (dest.id === 'benefits') setSelectedBenefitsDrawerItem('overview');
                      else if (dest.id === 'culture') setSelectedCultureDrawerItem('culture');
                      else if (dest.id === 'help-center') setSelectedHelpDrawerItem('support');

                      const defaultItem = dest.id === 'culture' ? 'culture' : (dest.id === 'help-center' ? 'support' : 'overview');
                      onSelect?.(dest.id, defaultItem);
                    } else {
                      onSelect?.(dest.id);
                    }
                  }}
                  className="w-full h-16 flex flex-col items-center justify-center gap-1 group"
                  id={`nav-rail-item-${dest.id}`}
                >
                  <div
                    className={`w-14 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#C2E7FF]' : 'hover:bg-black/5'
                      }`}
                  >
                    <div className={isActive ? 'text-[#004A77]' : 'text-[#444746]'}>
                      {dest.icon}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${isActive ? 'text-[#004A77]' : 'text-[#444746]'
                      }`}
                  >
                    {dest.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>



      {/* Scrim to close drawer when clicking outside */}
      {openDrawerId && (
        <div
          className="fixed inset-0 left-[96px] bg-transparent z-25"
          onClick={() => setOpenDrawerId(null)}
        />
      )}

      {/* Drawer Container (for overflow clipping) */}
      <div
        className="absolute left-[96px] top-0 bottom-0 w-[300px] overflow-hidden z-30 pointer-events-none"
      >
        {/* Drawer for Recent */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'recent' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'recent' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-recent"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            <div className="px-4 py-2 text-xs font-medium text-[#747775] uppercase tracking-wider mb-2">Recent chats</div>
            {(() => {
              const recentChats = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('recent_chats') || '[]') : [];
              if (recentChats.length === 0) {
                return <p className="text-sm text-[#747775] px-4 py-2">No recent chats</p>;
              }
              return recentChats.map((chat: any) => (
                <div key={chat.id} className="w-full flex flex-col px-4 py-2 cursor-pointer hover:bg-black/5 rounded-lg mb-1">
                  <span className="text-sm font-medium text-[#444746] truncate">{chat.prompt}</span>
                  <span className="text-xs text-[#747775] mt-0.5">{chat.date}</span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Drawer for Growth */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'growth' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'growth' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-growth"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('overview'); onSelect?.('growth', 'overview'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentGrowthSelection === 'overview' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Overview</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('career'); onSelect?.('growth', 'career'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentGrowthSelection === 'career' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Career development</span>
            </div>
            <a
              href="https://growth.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Grow</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); setIsGrowthHelpExpanded(!isGrowthHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Growth help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isGrowthHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isGrowthHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Support Center</div>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('profiles'); onSelect?.('growth', 'profiles'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentGrowthSelection === 'profiles' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Role profiles</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('learning'); onSelect?.('growth', 'learning'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'learning' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Learning</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('location'); onSelect?.('growth', 'location'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'location' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Location transfer</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('role'); onSelect?.('growth', 'role'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'role' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Role transfer</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('immigration'); onSelect?.('growth', 'immigration'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'immigration' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Immigration</span>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('mobility'); onSelect?.('growth', 'mobility'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'mobility' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Mobility support</span>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); setIsGrowthWorkplaceExpanded(!isGrowthWorkplaceExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Workplace</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-200 ${isGrowthWorkplaceExpanded ? 'rotate-180' : ''}`}>
                  <path d="M10 13.4L4 7.4L5.4 6L10 10.6L14.6 6L16 7.4L10 13.4Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isGrowthWorkplaceExpanded ? 'max-h-[200px]' : 'max-h-0'} shrink-0`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Spaces</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Guidelines</div>
            </div>
            <div className="w-full flex justify-center my-1">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>
            <div
              onClick={() => { setSelectedGrowthDrawerItem('school'); onSelect?.('growth', 'school'); }}
              className={`w-full h-14 flex items-center gap-3 px-4 cursor-pointer rounded-full mb-1 ${currentGrowthSelection === 'school' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">The Google School</span>
            </div>
          </div>
        </div>

        {/* Drawer for Performance */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'performance' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'performance' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-performance"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            <div
              onClick={() => { setSelectedPerfDrawerItem('overview'); onSelect?.('performance', 'overview'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'overview' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Overview</span>
            </div>
            <a
              href="https://grad.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">GRAD</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); setIsPerfHelpExpanded(!isPerfHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Performance help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isPerfHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isPerfHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Guidelines</div>
            </div>
            <div
              onClick={() => { setSelectedPerfDrawerItem('timeline'); onSelect?.('performance', 'timeline'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'timeline' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Timeline</span>
            </div>
            <div
              onClick={() => { setSelectedPerfDrawerItem('expectations'); onSelect?.('performance', 'expectations'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'expectations' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Expectations & check-ins</span>
            </div>
            <div
              onClick={() => { setSelectedPerfDrawerItem('feedback'); onSelect?.('performance', 'feedback'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'feedback' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Feedback & surveys</span>
            </div>
            <div
              onClick={() => { setSelectedPerfDrawerItem('discussions'); onSelect?.('performance', 'discussions'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'discussions' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">People discussions</span>
            </div>
            <div
              onClick={() => { setSelectedPerfDrawerItem('reviews'); onSelect?.('performance', 'reviews'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentPerfSelection === 'reviews' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Annual reviews</span>
            </div>
          </div>
        </div>

        {/* Drawer for Compensation */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'compensation' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'compensation' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-compensation"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            <div
              onClick={() => { setSelectedCompDrawerItem('overview'); onSelect?.('compensation', 'overview'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCompSelection === 'overview' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Overview</span>
            </div>
            <a
              href="https://prosper.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Prosper</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); setIsCompHelpExpanded(!isCompHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Compensation help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isCompHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isCompHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Policy Documents</div>
            </div>
            <div
              onClick={() => { setSelectedCompDrawerItem('policy'); onSelect?.('compensation', 'policy'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCompSelection === 'policy' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Compensation policy</span>
            </div>
            <div
              onClick={() => { setSelectedCompDrawerItem('pay'); onSelect?.('compensation', 'pay'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCompSelection === 'pay' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Pay & taxes</span>
            </div>
            <div
              onClick={() => { setSelectedCompDrawerItem('equity'); onSelect?.('compensation', 'equity'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCompSelection === 'equity' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Equity</span>
            </div>
            <div
              onClick={() => { setSelectedCompDrawerItem('gtime'); onSelect?.('compensation', 'gtime'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCompSelection === 'gtime' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">gTime</span>
            </div>
          </div>
        </div>

        {/* Drawer for Hiring */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'hiring' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'hiring' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-hiring"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            <div
              onClick={() => { setSelectedHiringDrawerItem('overview'); onSelect?.('hiring', 'overview'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentHiringSelection === 'overview' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Overview</span>
            </div>
            <a
              href="https://hiring.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Hiring at Google</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#clip0_10788_hiring_link)">
                    <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10788_hiring_link">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); setIsHiringHelpExpanded(!isHiringHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Hiring help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isHiringHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isHiringHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Hiring help</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Interns & researchers</div>
            </div>
          </div>
        </div>

        {/* Drawer for Benefits */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'benefits' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'benefits' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-benefits"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            {/* Overview */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('overview'); onSelect?.('benefits', 'overview'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'overview' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Overview</span>
            </div>

            {/* Internet reimbursement */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('internet'); onSelect?.('benefits', 'internet'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'internet' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Internet reimbursement</span>
            </div>

            {/* gBenefits (Link) */}
            <a
              href="https://benefits.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">gBenefits</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#clip0_10788_benefits_link)">
                    <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10788_benefits_link">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>

            {/* Divider */}
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>

            {/* Benefits help (Accordion) */}
            <div
              onClick={(e) => { e.stopPropagation(); setIsBenefitsHelpExpanded(!isBenefitsHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Benefits help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isBenefitsHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isBenefitsHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Policy Documents</div>
            </div>

            {/* Time off & leave */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('timeoff'); onSelect?.('benefits', 'timeoff'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'timeoff' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Time off & leave</span>
            </div>

            {/* Healthcare & insurance */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('healthcare'); onSelect?.('benefits', 'healthcare'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'healthcare' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Healthcare & insurance</span>
            </div>

            {/* Financial benefits */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('financial'); onSelect?.('benefits', 'financial'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'financial' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Financial benefits</span>
            </div>

            {/* Wellbeing */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('wellbeing'); onSelect?.('benefits', 'wellbeing'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'wellbeing' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Wellbeing</span>
            </div>

            {/* Additional benefits */}
            <div
              onClick={() => { setSelectedBenefitsDrawerItem('additional'); onSelect?.('benefits', 'additional'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentBenefitsSelection === 'additional' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Additional benefits</span>
            </div>
          </div>
        </div>

        {/* Drawer for Culture */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'culture' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'culture' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-culture"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            {/* Culture */}
            <div
              onClick={() => { setSelectedCultureDrawerItem('culture'); onSelect?.('culture', 'culture'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCultureSelection === 'culture' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Culture</span>
            </div>

            {/* Engage at Google */}
            <div
              onClick={() => { setSelectedCultureDrawerItem('engage'); onSelect?.('culture', 'engage'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCultureSelection === 'engage' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Engage at Google</span>
            </div>

            {/* gThanks (Link) */}
            <a
              href="https://thanks.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">gThanks</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#clip0_10788_culture_link1)">
                    <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10788_culture_link1">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>

            {/* Googlegeist (Link) */}
            <a
              href="https://googlegeist.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Googlegeist</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#clip0_10788_culture_link2)">
                    <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10788_culture_link2">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>

            {/* Divider */}
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>

            {/* Culture help (Accordion) */}
            <div
              onClick={(e) => { e.stopPropagation(); setIsCultureHelpExpanded(!isCultureHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Culture help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isCultureHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isCultureHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Guidelines</div>
            </div>

            {/* Recognition */}
            <div
              onClick={() => { setSelectedCultureDrawerItem('recognition'); onSelect?.('culture', 'recognition'); }}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${currentCultureSelection === 'recognition' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Recognition</span>
            </div>
          </div>
        </div>

        {/* Drawer for Help Center */}
        <div
          className={`w-[256px] h-full bg-[#F8FAFD] flex flex-col items-center py-2 transition-transform duration-300 ease-in-out pointer-events-auto absolute top-0 left-0 ${openDrawerId === 'help-center' ? 'translate-x-0' : '-translate-x-full'}`}
          style={openDrawerId === 'help-center' ? {
            boxShadow: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)'
          } : {}}
          id="nav-drawer-help"
        >
          <div className="w-[240px] flex flex-col overflow-y-auto px-2" onClick={() => setOpenDrawerId(null)}>
            {/* Get support */}
            <div
              onClick={() => setSelectedHelpDrawerItem('support')}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${selectedHelpDrawerItem === 'support' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Get support</span>
            </div>

            {/* Requests */}
            <div
              onClick={() => setSelectedHelpDrawerItem('requests')}
              className={`w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 shrink-0 ${selectedHelpDrawerItem === 'requests' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Requests</span>
                <span className="w-4 h-4 flex items-center justify-center bg-[#B3261E] text-white text-[11px] font-medium rounded-full">3</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>

            {/* Additional help (Accordion) */}
            <div
              onClick={(e) => { e.stopPropagation(); setIsAdditionalHelpExpanded(!isAdditionalHelpExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-base font-medium">Additional help</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isAdditionalHelpExpanded ? 'rotate-180' : ''}`}>
                  <path d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isAdditionalHelpExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">FAQ</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Guides</div>
            </div>

            {/* Employment info */}
            <div
              onClick={() => setSelectedHelpDrawerItem('employment')}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${selectedHelpDrawerItem === 'employment' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Employment info</span>
            </div>

            {/* MyConcerns (Link) */}
            <a
              href="https://myconcerns.google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer rounded-full mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">MyConcerns</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#clip0_10788_help_link1)">
                    <path d="M4.5 17C4.08333 17 3.72917 16.8542 3.4375 16.5625C3.14583 16.2708 3 15.9167 3 15.5V4.5C3 4.08333 3.14583 3.72917 3.4375 3.4375C3.72917 3.14583 4.08333 3 4.5 3H10V4.5H4.5V15.5H15.5V10H17V15.5C17 15.9167 16.8542 16.2708 16.5625 16.5625C16.2708 16.8542 15.9167 17 15.5 17H4.5ZM8.0625 13L7 11.9375L14.4375 4.5H12V3H17V8H15.5V5.5625L8.0625 13Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10788_help_link1">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>

            {/* Managers */}
            <div
              onClick={() => setSelectedHelpDrawerItem('managers')}
              className={`w-full h-14 flex items-center px-4 cursor-pointer rounded-full mb-1 shrink-0 ${selectedHelpDrawerItem === 'managers' ? 'bg-[#C2E7FF] text-[#004A77]' : 'hover:bg-black/5 text-[#444746]'}`}
            >
              <span className="text-sm font-medium">Managers</span>
            </div>

            {/* Divider */}
            <div className="w-full flex justify-center my-1 shrink-0">
              <div className="w-[208px] h-[1px] bg-[#C4C7C5]"></div>
            </div>

            {/* Culture (Accordion header with arrow down) */}
            <div
              onClick={(e) => { e.stopPropagation(); setIsHelpCultureExpanded(!isHelpCultureExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Culture</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isHelpCultureExpanded ? 'rotate-180' : ''}`}>
                  <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isHelpCultureExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Overview</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Events</div>
            </div>

            {/* Engage at Google (Accordion header with arrow down) */}
            <div
              onClick={(e) => { e.stopPropagation(); setIsHelpEngageExpanded(!isHelpEngageExpanded); }}
              className="w-full h-14 flex items-center justify-between px-4 cursor-pointer mb-1 text-[#444746] hover:bg-black/5 shrink-0"
            >
              <span className="text-sm font-medium">Engage at Google</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-200 ${isHelpEngageExpanded ? 'rotate-180' : ''}`}>
                  <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-200 ${isHelpEngageExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Programs</div>
              <div className="w-full h-10 flex items-center px-8 cursor-pointer hover:bg-black/5 text-[#444746] text-sm">Resources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationRail;
