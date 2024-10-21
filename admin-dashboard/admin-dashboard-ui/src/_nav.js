import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  
  {
    component: CNavTitle,
    name: 'Components',
  },
  
  {
    component: CNavGroup,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Room Service',
        to: '/orders/room_service',
      },
      {
        component: CNavItem,
        name: 'Food Delivery',
        to: '/orders/food_delivery',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Review Analytics',
    to: '/reviews',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Insights',
        to: '/reviews/insights',
      }
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Events',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'What to Host!!',
        to: '/events/what-to-host',
      },
      {
        component: CNavItem,
        name: 'Wellness Retreats',
        to: '/events/wellness',
      },
      {
        component: CNavItem,
        name: 'Gigs',
        to: '/events/gigs',
      },
      {
        component: CNavItem,
        name: 'Social Media Events',
        to: '/events/sme',
      },
      {
        component: CNavItem,
        name: 'Manage Events',
        to: '/forms/input-group',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Loyalty Program',
    to: '/loyalty',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Partnerships',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Collaborations',
        to: '/partners/collaborations',
       
      },
      {
        component: CNavItem,
        name: 'Reach Out!',
        to: '/partners/reach-out',
      },
      {
        component: CNavItem,
        name: 'Packages',
        to: '/partners/packages',
      },
      {
        component: CNavItem,
        name: 'Targetted Ads',
        to: '/partners/tads',
      },
      {
        component: CNavItem,
        name: 'Miscellaneous',
        to: '/partners/misc',
      },
    ],
  },
  
  {
    component: CNavItem,
    name: 'Lyf Community',
    to: '/community',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  
]

export default _nav
