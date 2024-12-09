// menu-items.ts

export const menuItems = {
  superAdmin: [
    { label: 'Dashboard', route: '/superadmin/dashboard', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Admins', route: '/superadmin/admin', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Physicians', route: '/superadmin/physician', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Patients', route: '/superadmin/patient', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Logout', icon: 'assets/img/icons/logout.svg' }
  ],
  admin: [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Physicians', route: '/admin/physician', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Patients', route: '/admin/patient', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Staff', route: '/admin/staff', icon: 'assets/img/icons/menu-icon-01.svg' },

    { label: 'Logout', icon: 'assets/img/icons/logout.svg' }
  ],
  physician: [
    { label: 'Dashboard', route: '/physician/dashboard', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Patients', route: '/physician/patient', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Logout', icon: 'assets/img/icons/logout.svg' }
  ],
  staff: [
    { label: 'Dashboard', route: '/staff/dashboard', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Patients', route: '/staff/patient', icon: 'assets/img/icons/menu-icon-01.svg' },
    { label: 'Logout', icon: 'assets/img/icons/logout.svg' }
  ]
};
