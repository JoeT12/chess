import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "@/components/ui/footer";
import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="w-full bg-background px-4">
      <div className="mx-auto max-w-container">
        <Footer className="border-t pt-8">
          <FooterContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <FooterColumn className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Chess</h3>
              </div>
              <div className="ml-2.5 flex gap-4 sm:ml-0">
                <Link href="/" className="text-muted-foreground">
                  <span className="sr-only">GitHub</span>
                  <FaGithub className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-muted-foreground">
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-muted-foreground">
                  <span className="sr-only">Discord</span>
                  <FaDiscord className="h-5 w-5" />
                </Link>
              </div>
            </FooterColumn>
            <FooterColumn className="flex flex-col items-center">
              <h3 className="text-md pt-1 font-semibold">Product</h3>
              <a href="/changelog" className="text-sm text-muted-foreground">
                Changelog
              </a>
              <a href="/documentation" className="text-sm text-muted-foreground">
                Documentation
              </a>
            </FooterColumn>
            <FooterColumn className="flex flex-col items-center">
              <h3 className="text-md pt-1 font-semibold">Company</h3>
              <a href="/about" className="text-sm text-muted-foreground">
                About
              </a>
              <a href="/careers" className="text-sm text-muted-foreground">
                Careers
              </a>
              <a href="/blog" className="text-sm text-muted-foreground">
                Blog
              </a>
            </FooterColumn>
            <FooterColumn className="flex flex-col items-center">
              <h3 className="text-md pt-1 font-semibold">Contact</h3>
              <a href="#" className="text-sm text-muted-foreground">
                Discord
              </a>
              <a href="#" className="text-sm text-muted-foreground">
                Twitter
              </a>
              <a href="/" className="text-sm text-muted-foreground">
                Github
              </a>
            </FooterColumn>
            <FooterColumn className="flex flex-col items-center">
              <h3 className="text-md pt-1 font-semibold">Legal</h3>
              <a href="/privacy-policy" className="text-sm text-muted-foreground">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-sm text-muted-foreground">
                Terms of Service
              </a>
              <a href="/cookie-policy" className="text-sm text-muted-foreground">
                Cookie Policy
              </a>
            </FooterColumn>
          </FooterContent>
        </Footer>
      </div>
    </footer>
  );
}
