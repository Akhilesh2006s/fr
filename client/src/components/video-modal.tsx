import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, Play, Clock, BookOpen, Star, Share2, Download, Heart, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTubePlayer from '@/components/youtube-player';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    description: string;
    duration: number;
    subject: string;
    youtubeUrl?: string;
    videoUrl?: string;
    isYouTubeVideo?: boolean;
  } | null;
}

const VideoModal = ({ isOpen, onClose, video }: VideoModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!video) return null;

  const handleOpenInNewTab = () => {
    if (video.isYouTubeVideo && video.youtubeUrl) {
      window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer');
    } else if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full flex flex-col"
            >
              {/* Epic Header with Gradient */}
              <DialogHeader className="relative p-6 pb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <DialogTitle className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {video.title}
                      </DialogTitle>
                    </motion.div>
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-4"
                    >
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {video.subject}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration} min
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center space-x-2"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsLiked(!isLiked)}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <ThumbsUp className={`w-4 h-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleShare}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleOpenInNewTab}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onClose}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </DialogHeader>
              
              {/* Epic Video Player Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-1 p-6 pt-4 relative"
              >
                <div className="h-full relative group">
                  {/* Glowing Border Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  
                  <div className="relative h-full bg-black rounded-xl overflow-hidden shadow-2xl">
                    {video.isYouTubeVideo && video.youtubeUrl ? (
                      <YouTubePlayer 
                        videoUrl={video.youtubeUrl}
                        title={video.title}
                        className="w-full h-full"
                      />
                    ) : video.videoUrl ? (
                      <div className="w-full h-full relative">
                        <video 
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                        >
                          <source src={video.videoUrl} type="video/mp4" />
                          <source src={video.videoUrl} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
                          >
                            <Play className="w-8 h-8 text-purple-600 ml-1" />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-center"
                        >
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-white text-lg font-medium mb-2">Video not available</p>
                          <p className="text-gray-400">No video URL provided</p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Epic Description Section */}
                {video.description && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-6 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Description</h3>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{video.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 mt-6">
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;

