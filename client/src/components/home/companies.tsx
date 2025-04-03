import { motion } from "framer-motion";

export default function Companies() {
  return (
    <section className="py-16 relative bg-[rgb(24,24,26)]">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-medium text-2xl md:text-3xl mb-4 text-white">
            Engineers working and interviewed at
          </h2>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#00B4EF]">QUALCOMM</span>
          </div>
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#76B900]">NVIDIA</span>
          </div>
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#A2AAAD]">APPLE</span>
          </div>
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#E82127]">TESLA</span>
          </div>
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#00A4EF]">MICROSOFT</span>
          </div>
          <div className="h-10 flex items-center">
            <span className="text-2xl font-bold text-[#0668E1]">META</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
