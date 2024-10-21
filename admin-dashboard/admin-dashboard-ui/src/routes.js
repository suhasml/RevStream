import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const RoomServiceRequests = React.lazy(() => import('./views/orders/room_service/RoomServiceRequests'))
const FoodOrders = React.lazy(() => import('./views/orders/food_orders/FoodOrders'))

const collab = React.lazy(() => import('./views/partnership/collaborators/Collaborators'))
const ReachOut = React.lazy(() => import('./views/partnership/reachout/ReachOut'))
const Packages = React.lazy(() => import('./views/partnership/packages/Packages'))
const Tads = React.lazy(() => import('./views/partnership/targettedAds/targettedAds'))
const Misc = React.lazy(() => import('./views/partnership/Miscellaneous/Miscellaneous'))

const Community = React.lazy(() => import('./views/community/Community'))

// Buttons
const Insights = React.lazy(() => import('./views/buttons/Insights/Insights'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/events/gigs/Gigs'))
const FloatingLabels = React.lazy(() => import('./views/events/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/events/What_to_host/HostEvents'))
const InputGroup = React.lazy(() => import('./views/events/manage_events/ManageEvents'))
const Layout = React.lazy(() => import('./views/events/layout/Layout'))
const Range = React.lazy(() => import('./views/events/socialMedia/SocialMedia'))
const Select = React.lazy(() => import('./views/events/wellness_events/WellnessEvents'))
const Validation = React.lazy(() => import('./views/events/validation/Validation'))

const Charts = React.lazy(() => import('./views/LoyaltyProgram/Loyalty'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/orders', name: 'Orders', element: RoomServiceRequests, exact: true },
  { path: '/orders/room_service', name: 'Room Service', element: RoomServiceRequests },
  { path: '/orders/food_delivery', name: 'Food delivery', element: FoodOrders },
  { path: '/reviews', name: 'Review Analysis', element: Insights, exact: true },
  { path: '/reviews/insights', name: 'Insights', element: Insights },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/loyalty', name: 'Charts', element: Charts },
  { path: '/events', name: 'Events', element: FormControl, exact: true },
  { path: '/events/what-to-host', name: 'Host these', element: FormControl },
  { path: '/events/wellness', name: 'Wellness Events', element: Select },
  { path: '/events/gigs', name: 'Gigs', element: ChecksRadios },
  { path: '/events/sme', name: 'Social Media', element: Range },
  { path: '/forms/input-group', name: 'Manage Events', element: InputGroup },

  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },

  { path: '/icons', exact: true, name: 'Icons', element: collab },
  { path: '/partners/collaborations', name: 'Collaborators', element: collab },
  { path: '/partners/reach-out', name: 'Reach Out', element: ReachOut },
  { path: '/partners/packages', name: 'Packages', element: Packages },
  { path: '/partners/tads', name: 'Targetted Ads', element: Tads },
  { path: '/partners/packages', name: 'Packages', element: Packages },
  { path: '/partners/misc', name: 'Packages', element: Misc },


  { path: '/community', name: 'Widgets', element: Community },
]

export default routes
