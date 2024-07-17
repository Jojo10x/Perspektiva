import { useRouter } from 'next/router';

export default function CatchAll() {
  const router = useRouter();
  console.log('Catch-all route hit:', router.asPath);
  return <h1>404 - Page Not Found</h1>;
}