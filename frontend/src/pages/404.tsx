import Link from "next/link";
import { Button } from "react-bootstrap";

const Custom404 = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <h1 className="text-white">404 - Not found</h1>
      <div className="d-flex gap-2">
        <Link href="/" className="mt-1" passHref>
          <Button>Go to homepage</Button>
        </Link>
        <Link href="/articles" className="mt-1" passHref>
          <Button>Check our articles</Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
