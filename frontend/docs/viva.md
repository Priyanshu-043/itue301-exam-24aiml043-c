# FitZone Frontend Viva Questions

## 1. Why did you create a TrainerCard component?
It is reusable UI. Each trainer can be rendered with the same structure by passing trainer data as props.

## 2. Which props does TrainerCard accept?
`name`, `specialization`, and `available`.

## 3. How is availability displayed?
A small object map converts `true` to `Available` and `false` to `Fully Booked`, and conditional CSS classes change the appearance.

## 4. Why use React Router?
It provides client-side navigation between pages without a full browser reload.

## 5. What is a protected route?
A route that checks authentication before rendering. FitZone redirects an unauthenticated user to `/`.

## 6. Why use AuthContext?
Authentication data is shared across the application without passing props through unrelated components.

## 7. What does the AuthContext contain?
`member`, `token`, `role`, `login()`, and `logout()`.

## 8. Why use localStorage?
It keeps the token and member session available after a page refresh.

## 9. Why is AdminPanel lazy-loaded?
The page is loaded only when the admin route is visited, reducing the initial JavaScript bundle.

## 10. Why use useEffect in ClassesPage?
To fetch trainer data when the component mounts.

## 11. What three API states are maintained for trainers?
`trainers`, `loading`, and `error`.

## 12. How does trainer search work?
The complete fetched trainer array remains in state. The displayed array is derived using `.filter()` on specialization, so no new API request is sent for each search.

## 13. How does booking authentication work?
The frontend adds `Authorization: Bearer <token>` to the POST booking request.

## 14. What happens after login?
The returned token and member are passed to `AuthContext.login()`, stored in state/localStorage, and the user is navigated to `/classes`.

## 15. Why use state for the booking form?
The form needs controlled inputs and the selected trainer/time/date must update the UI as the user changes them.
