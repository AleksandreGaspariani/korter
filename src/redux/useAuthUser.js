import { useSelector } from 'react-redux'

// Usage: const user = useAuthUser();
// If you want to destructure: const { name } = useAuthUser() || {};
export function useAuthUser() {
  const auth = useSelector((state) => state.auth)
  // console.log(auth);

  return auth.user;
}
