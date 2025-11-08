import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "../contexts/UserContext";

interface Comment {
  id: string;
  userFid: number;
  userName: string;
  userImage: string;
  content: string;
  timestamp: string;
  isAnalyst: boolean;
  replyTo?: string;
}

interface CommentsProps {
  signalId: string;
  analystFid: number;
}

export function Comments({ signalId, analystFid }: CommentsProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      userFid: user.fid,
      userName: user.displayName,
      userImage: user.pfpUrl,
      content: newComment,
      timestamp: new Date().toISOString(),
      isAnalyst: user.fid === analystFid,
      replyTo: replyingTo || undefined
    };

    setComments([...comments, comment]);
    setNewComment("");
    setReplyingTo(null);
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-foreground mb-4">Discussion</h3>

      {/* Comment Input */}
      <div className="mb-4">
        {replyingTo && (
          <div className="text-xs text-muted-foreground mb-2">
            Replying to comment...{" "}
            <button
              onClick={() => setReplyingTo(null)}
              className="text-primary hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.pfpUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.displayName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-input-background border-border resize-none min-h-[60px] text-sm"
            />
            <Button
              size="sm"
              className="mt-2 bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              <Send className="h-3 w-3 mr-1" />
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`flex gap-2 ${comment.replyTo ? 'ml-8' : ''}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userImage} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {comment.userName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-foreground">{comment.userName}</span>
                  {comment.isAnalyst && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                      Analyst
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{comment.content}</p>
                {user?.fid === analystFid && !comment.isAnalyst && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
