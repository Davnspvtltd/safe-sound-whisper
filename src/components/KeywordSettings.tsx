import { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface KeywordSettingsProps {
  keywords: string[];
  onUpdate: (keywords: string[]) => void;
}

const KeywordSettings = ({ keywords, onUpdate }: KeywordSettingsProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAdd = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.toLowerCase().trim())) {
      onUpdate([...keywords, newKeyword.toLowerCase().trim()]);
      setNewKeyword("");
    }
  };

  const handleRemove = (keyword: string) => {
    onUpdate(keywords.filter((k) => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-soft space-y-4">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Emergency Keywords
      </h3>
      
      <p className="text-sm text-muted-foreground">
        The system will trigger an alert when any of these words are detected.
      </p>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {keyword}
            <button
              onClick={() => handleRemove(keyword)}
              className="ml-2 hover:text-destructive transition-colors"
              aria-label={`Remove ${keyword}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add new keyword..."
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-background border-input flex-1"
        />
        <Button onClick={handleAdd} variant="default" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default KeywordSettings;
