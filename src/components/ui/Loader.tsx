import { RiLeafLine } from "react-icons/ri";
import { motion } from "framer-motion";

interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ fullScreen = false, text = "Loading..." }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center"
      >
        <RiLeafLine className="text-primary text-lg" />
      </motion.div>
      <p className="text-muted-foreground text-sm font-medium">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex justify-center py-16">{content}</div>;
}
