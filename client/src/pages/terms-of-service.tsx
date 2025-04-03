import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const [_, setLocation] = useLocation();
  
  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black app-container">
      <Header 
        onNavigateFeatures={navigateToFeatures}
        onNavigateProblems={navigateToProblems}
        isScrolled={true}
      />
      
      <main className="flex-grow container mx-auto px-4 py-12 pt-24 pb-40 scrollable-content">
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
              <p className="text-[rgb(214,251,65)] mb-8">Last Updated: April 3, 2025</p>
              
              <Separator className="my-6 bg-gray-700/30" />
              
              <div className="space-y-8 text-gray-300 mb-40">
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="mb-4">
                    By accessing or using dspcoder.com ("the Website"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                  <p>
                    These Terms of Service apply to all users of the Website, including users who are browsers, customers, contributors, or companies.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                  <p className="mb-4">
                    dspcoder.com is an educational platform that provides resources, practice problems, and learning tools for embedded systems programming and technical interview preparation.
                  </p>
                  <p className="mb-4">
                    We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                  <p className="mb-4">
                    Some features of the Website require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <p className="mb-4">
                    You agree to notify us immediately of any unauthorized use of your account. We are not responsible for any loss or damage arising from your failure to comply with this obligation.
                  </p>
                  <p>
                    We reserve the right to disable any user account if, in our opinion, you have violated any provision of these Terms of Service.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">4. User Content</h2>
                  <p className="mb-4">
                    You retain ownership of any content you submit, post, or display on or through the service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.
                  </p>
                  <p className="mb-4">
                    You are solely responsible for your User Content and the consequences of posting it. We do not endorse any User Content and have no obligation to monitor it.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                  <p className="mb-4">
                    The Website, its original content, features, and functionality are owned by dspcoder.com and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You may not use, reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, transmit, or exploit any content from our Website without express written permission.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
                  <p className="mb-4">
                    You agree not to use our service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
                    <li>To attempt to gain unauthorized access to our systems or user accounts</li>
                    <li>To introduce viruses, trojans, worms, or other harmful material</li>
                    <li>To extract data from our platform using automated means</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                  <p className="mb-4">
                    To the maximum extent permitted by law, dspcoder.com shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
                  <p className="mb-4">
                    The service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                  <p>
                    We may revise these Terms of Service at any time without notice. By continuing to access or use our service after revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">10. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at support@dspcoder.com.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}