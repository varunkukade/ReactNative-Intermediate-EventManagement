export const reduxToolkitStatuses = {
    fulfilled: 'fulfilled',
    rejected: 'rejected'
}

export const PAGINATION_CONSTANT = 10
export const GOOGLE_CONST = "google.com"
export const VERSION_CONST = "Version 1.0.0"
export const MAX_BULK_ADDITION = 200

export type WelcomeScreenState = {
    id: number;
    active: boolean;
    mainText: string
}
export const initialWelcomeScreens: WelcomeScreenState[] = [
    {
      id: 1,
      active: true,
      mainText: 'Event Management Is Now More Simpler, Easier And Practical!',
    },
    {
      id: 2,
      active: false,
      mainText: 'Create Events, Create Common Guests, Add Guest To Event.',
    },
    {
      id: 3,
      active: false,
      mainText:
        'Invite Users To App And They Can Stay Updated with New Events.',
    },
  ];