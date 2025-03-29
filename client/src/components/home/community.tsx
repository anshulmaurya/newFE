import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Community() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the email to a newsletter service
    console.log("Subscribe with email:", email);
    // Reset the form
    setEmail("");
    // Show a success message
    alert("Thank you for subscribing to our newsletter!");
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the feedback to a server
    console.log("Feedback submitted:", { message, contactEmail });
    // Reset the form
    setMessage("");
    setContactEmail("");
    // Show a success message
    alert("Thank you for your feedback!");
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[rgb(18,18,20)]">
      {/* Background gradients */}
      <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-[rgb(214,251,65)]/5 rounded-full blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            <span className="text-white">Join Our</span>
            <span className="text-[rgb(214,251,65)]"> Community</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join our community to share interview experiences, gain insights, and explore job opportunities. 
            Connect, learn, and grow with like-minded professionals!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Community Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass rounded-lg p-6 bg-[rgb(24,24,26)] border border-[rgb(30,30,32)]/30">
              <h3 className="text-2xl font-display font-bold mb-6 text-white">
                Don't hesitate to reach out.
                <br />We're always here to help.
              </h3>
              <p className="text-gray-300 mb-8">
                Have questions, feedback, or anything to say? Tell us. We usually get back within 1-2 days.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:support@dspcoder.com" 
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-white">Email us</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                
                <a 
                  href="https://discord.gg/HxAqXd8Xwt" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#5865F2] p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                      </svg>
                    </div>
                    <span className="text-white">Join Discord (public)</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                
                <a 
                  href="https://www.linkedin.com/company/dspcoder" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#0a66c2] p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                      </svg>
                    </div>
                    <span className="text-white">Follow our LinkedIn page</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                
                <a 
                  href="https://twitter.com/dspcodercom" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <span className="text-white">Follow us on X</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                
                <a 
                  href="https://github.com/dspcoder" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </div>
                    <span className="text-white">Follow us on GitHub</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                
                <a 
                  href="https://reddit.com/r/dspcoder" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[rgb(18,18,20)] hover:bg-[rgb(30,30,32)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#ff4500] p-2 rounded-md bg-[rgb(30,30,32)] group-hover:bg-[rgb(24,24,26)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                      </svg>
                    </div>
                    <span className="text-white">Join Reddit community</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Feedback & Subscribe */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass rounded-lg p-6 bg-[rgb(24,24,26)] border border-[rgb(30,30,32)]/30">
              <h3 className="text-xl font-semibold mb-4 text-white">Message Us</h3>
              <form onSubmit={handleFeedback}>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm text-gray-300 mb-1">* Message</label>
                  <textarea 
                    id="message" 
                    className="w-full p-3 bg-[rgb(18,18,20)] border border-[rgb(30,30,32)] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgb(214,251,65)]"
                    rows={6}
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="block text-sm text-gray-300 mb-1">Contact email (optional)</label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    className="w-full p-3 bg-[rgb(18,18,20)] border border-[rgb(30,30,32)] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgb(214,251,65)]"
                    placeholder="john@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">If you'd like a reply, please provide your email address</p>
                </div>
                <Button
                  type="submit"
                  className="mt-2 w-full sm:w-auto px-6 py-2 bg-[rgb(214,251,65)] text-black font-medium rounded-md hover:bg-[rgb(194,231,45)] transition-colors"
                >
                  Send message
                </Button>
              </form>
            </div>

            <div className="glass rounded-lg p-6 bg-[rgb(24,24,26)] border border-[rgb(30,30,32)]/30">
              <h3 className="text-xl font-semibold mb-4 text-white">Subscribe to our newsletter</h3>
              <p className="text-gray-300 mb-4">Stay updated with new features, tips, and embedded systems insights.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  className="flex-1 p-3 bg-[rgb(18,18,20)] border border-[rgb(30,30,32)] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgb(214,251,65)]"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="px-4 py-2 bg-[rgb(214,251,65)] text-black font-medium rounded-md hover:bg-[rgb(194,231,45)] transition-colors"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}