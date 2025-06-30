"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ThumbsUpIcon, ThumbsDownIcon, TagIcon, MessageCircleIcon, LockIcon, GlobeIcon, UsersIcon, ImageIcon, SendIcon, ReplyIcon } from "lucide-react";
import type { PersonalPost, PersonalTag, PersonalRecommendation, PersonalComment } from "@/types";

interface PersonalProfileScreenProps {
  userId: string;
}

const PersonalProfileScreen: React.FC<PersonalProfileScreenProps> = ({ userId }) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<PersonalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [postDetails, setPostDetails] = useState<Record<string, {
    tags: PersonalTag[];
    recommendations: PersonalRecommendation[];
    comments: PersonalComment[];
  }>>({});
  const [tagInput, setTagInput] = useState("");
  const [privacy, setPrivacy] = useState<'public' | 'connections' | 'private'>("public");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/personal-profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: PersonalPost[] = await res.json();
      setPosts(data);
      // Fetch details for each post
      const details: Record<string, { tags: PersonalTag[]; recommendations: PersonalRecommendation[]; comments: PersonalComment[] }> = {};
      await Promise.all(
        data.map(async (post) => {
          const res = await fetch(`/api/personal-profile/${userId}/posts/${post.id}`);
          if (res.ok) {
            const { tags, recommendations, comments } = await res.json();
            details[post.id] = { tags, recommendations, comments };
          } else {
            details[post.id] = { tags: [], recommendations: [], comments: [] };
          }
        })
      );
      setPostDetails(details);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- Media upload logic ---
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  // --- Tagging logic ---
  const handleAddTag = async (postId: string) => {
    if (!tagInput.trim()) return;
    try {
      await fetch(`/api/personal-profile/${userId}/posts/${postId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taggedUserId: tagInput, createdBy: userId, status: "pending" })
      });
      setTagInput("");
      fetchPosts();
    } catch {}
  };

  // --- Recommendation logic ---
  const handleRecommend = async (postId: string, type: 'upvote' | 'downvote') => {
    try {
      await fetch(`/api/personal-profile/${userId}/posts/${postId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type })
      });
      fetchPosts();
    } catch {}
  };

  // --- Comment logic ---
  const handleAddComment = async (postId: string, parentCommentId?: string) => {
    const content = parentCommentId ? replyInputs[parentCommentId] : commentInputs[postId];
    if (!content?.trim()) return;
    try {
      await fetch(`/api/personal-profile/${userId}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content, parentCommentId })
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setReplyInputs((prev) => ({ ...prev, [parentCommentId || ""]: "" }));
      fetchPosts();
    } catch {}
  };

  // --- Privacy selection ---
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacy(e.target.value as any);
  };

  // --- Media upload for new post ---
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post", description: "Please enter some content.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      let mediaUrls: any[] = [];
      if (mediaFiles.length > 0) {
        // Simulate upload, replace with real upload logic
        mediaUrls = mediaFiles.map((file) => ({ type: file.type.startsWith('image') ? 'image' : 'document', url: URL.createObjectURL(file), fileName: file.name }));
      }
      const res = await fetch(`/api/personal-profile/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent, privacy, media: mediaUrls })
      });
      if (!res.ok) throw new Error("Failed to create post");
      setNewPostContent("");
      setMediaFiles([]);
      fetchPosts();
      toast({ title: "Post Created", description: "Your post was added." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render threaded comments ---
  const renderComments = (comments: PersonalComment[], postId: string, parentId?: string, level = 0) => {
    return comments.filter(c => c.parentCommentId === parentId).map(comment => (
      <div key={comment.id} className={`mb-1 pl-${2 + level * 4} border-l text-xs`}>
        <span className="font-medium">{comment.userId}</span>: {comment.content}
        <Button size="xs" variant="ghost" className="ml-2 px-1 py-0.5 text-xs" onClick={() => setReplyInputs(prev => ({ ...prev, [comment.id]: "" }))}><ReplyIcon className="w-3 h-3 inline" /> Reply</Button>
        {replyInputs[comment.id] !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <Input size="sm" className="text-xs" value={replyInputs[comment.id] || ""} onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))} placeholder="Reply..." />
            <Button size="xs" variant="outline" onClick={() => handleAddComment(postId, comment.id)}><SendIcon className="w-3 h-3" /></Button>
          </div>
        )}
        {renderComments(comments, postId, comment.id, level + 1)}
      </div>
    ));
  };

  return (
    <ScrollArea className="h-full bg-muted/20">
      <div className="max-w-3xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="Share something..."
              rows={3}
              className="mb-2"
            />
            <div className="flex items-center gap-2 mb-2">
              <select value={privacy} onChange={handlePrivacyChange} className="text-xs border rounded px-2 py-1">
                <option value="public"> <GlobeIcon className="inline w-3 h-3 mr-1" /> Public</option>
                <option value="connections"> <UsersIcon className="inline w-3 h-3 mr-1" /> Connections</option>
                <option value="private"> <LockIcon className="inline w-3 h-3 mr-1" /> Private</option>
              </select>
              <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}><ImageIcon className="w-4 h-4" /></Button>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={handleMediaChange} />
              {mediaFiles.length > 0 && <span className="text-xs">{mediaFiles.length} file(s) selected</span>}
            </div>
            <Button onClick={handleCreatePost} disabled={isSaving || !newPostContent.trim()}>
              {isSaving ? "Posting..." : "Post"}
            </Button>
          </CardContent>
        </Card>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-destructive text-center py-8">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No posts yet.</div>
        ) : (
          posts.map(post => {
            const details = postDetails[post.id] || { tags: [], recommendations: [], comments: [] };
            const upvotes = details.recommendations.filter(r => r.type === "upvote").length;
            const downvotes = details.recommendations.filter(r => r.type === "downvote").length;
            return (
              <Card key={post.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">{post.content}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-2">{new Date(post.createdAt || post.created_at).toLocaleString()}</div>
                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.media.map((m, i) => m.type === 'image' ? (
                        <img key={i} src={m.url} alt={m.fileName} className="w-24 h-24 object-cover rounded" />
                      ) : (
                        <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs underline">{m.fileName || m.url}</a>
                      ))}
                    </div>
                  )}
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {details.tags.map(tag => (
                      <Badge key={tag.id} variant={tag.status === 'approved' ? 'default' : 'outline'}>
                        <TagIcon className="inline w-3 h-3 mr-1" /> {tag.taggedUserId || tag.taggedGroupId} {tag.status !== 'approved' && `(${tag.status})`}
                      </Badge>
                    ))}
                    <div className="flex items-center gap-1">
                      <Input size="sm" className="text-xs w-24" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Tag user..." />
                      <Button size="xs" variant="outline" onClick={() => handleAddTag(post.id)}><TagIcon className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  {/* Recommendations */}
                  <div className="flex items-center gap-4 mb-2">
                    <Button size="icon" variant="ghost" className="p-1" onClick={() => handleRecommend(post.id, 'upvote')}><ThumbsUpIcon className="w-4 h-4" /> <span className="ml-1 text-xs">{upvotes}</span></Button>
                    <Button size="icon" variant="ghost" className="p-1" onClick={() => handleRecommend(post.id, 'downvote')}><ThumbsDownIcon className="w-4 h-4" /> <span className="ml-1 text-xs">{downvotes}</span></Button>
                  </div>
                  {/* Comments */}
                  <div className="mb-2">
                    <div className="font-semibold text-xs mb-1 flex items-center"><MessageCircleIcon className="w-3 h-3 mr-1" /> Comments</div>
                    {renderComments(details.comments, post.id)}
                    <div className="flex items-center gap-1 mt-1">
                      <Input size="sm" className="text-xs" value={commentInputs[post.id] || ""} onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} placeholder="Add a comment..." />
                      <Button size="xs" variant="outline" onClick={() => handleAddComment(post.id)}><SendIcon className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  {/* Privacy */}
                  <div className="text-xs text-muted-foreground">Privacy: <Badge variant="outline">{post.privacy}</Badge></div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export default PersonalProfileScreen;
