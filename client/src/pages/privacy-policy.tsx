import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const [_, setLocation] = useLocation();
  
  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header 
        onNavigateFeatures={navigateToFeatures}
        onNavigateProblems={navigateToProblems}
        isScrolled={true}
      />
      
      <main className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4 text-gray-400 hover:text-white"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="bg-[rgb(24,24,26)] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
              <p className="text-[rgb(214,251,65)] mb-8">Last Updated: April 3, 2025</p>
              
              <Separator className="my-6 bg-gray-700/30" />
              
              <ScrollArea className="pr-4 h-[60vh] md:h-[65vh] overflow-y-auto">
                <div className="space-y-8 text-gray-300">
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                    <p className="mb-4">
                      At dspcoder.com, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">2. Data We Collect</h2>
                    <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><span className="font-medium text-white">Identity Data</span>: includes username, name, or similar identifier.</li>
                      <li><span className="font-medium text-white">Contact Data</span>: includes email address.</li>
                      <li><span className="font-medium text-white">Technical Data</span>: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                      <li><span className="font-medium text-white">Usage Data</span>: includes information about how you use our website and services.</li>
                      <li><span className="font-medium text-white">Profile Data</span>: includes your username and password, preferences, feedback, and survey responses.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">3. How We Collect Your Data</h2>
                    <p className="mb-4">We use different methods to collect data from and about you including through:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><span className="font-medium text-white">Direct interactions</span>: You may give us your information by filling in forms or by corresponding with us.</li>
                      <li><span className="font-medium text-white">Automated technologies or interactions</span>: As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions, and patterns.</li>
                      <li><span className="font-medium text-white">Third parties or publicly available sources</span>: We may receive personal data about you from various third parties, such as GitHub when you choose to authenticate through their services.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">4. How We Use Your Data</h2>
                    <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>To register you as a new user</li>
                      <li>To provide and improve our services</li>
                      <li>To manage our relationship with you</li>
                      <li>To administer and protect our business and website</li>
                      <li>To deliver relevant content and advertisements to you</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">5. Data Security</h2>
                    <p className="mb-4">
                      We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">6. Data Retention</h2>
                    <p className="mb-4">
                      We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">7. Your Legal Rights</h2>
                    <p className="mb-4">
                      Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The right to request access to your personal data</li>
                      <li>The right to request correction of your personal data</li>
                      <li>The right to request erasure of your personal data</li>
                      <li>The right to object to processing of your personal data</li>
                      <li>The right to request restriction of processing your personal data</li>
                      <li>The right to request transfer of your personal data</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">8. Cookies</h2>
                    <p className="mb-4">
                      Cookies are small text files that are placed on your computer by websites that you visit. We use cookies to distinguish you from other users of our website, remember your preferences, and provide enhanced features.
                    </p>
                    <p className="mb-4">
                      You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">9. Third-Party Links</h2>
                    <p className="mb-4">
                      This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                      We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this policy.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
                    <p>
                      If you have any questions or concerns about this privacy policy or our data practices, please contact us at privacy@dspcoder.com.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}