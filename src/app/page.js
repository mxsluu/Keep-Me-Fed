import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <h1>Welcome To Keep Me Fed</h1>
      <p>
        This is a Next.js application designed to help you with your meal schedule. Please make an account or sign in at the top right corner. 
      </p>
      <h2>Features</h2>
      <ul>
        <li>Schedule: Click here to create a schedule to help us suggest mealtimes and meals </li>
        <li>Food Finder: Click here to search for restaurants and recipes and find where the ingredients are sold </li>
        <li>History: Click here for a complete history of every meal you have eaten with us </li>
      </ul>
    </>
  );
}
