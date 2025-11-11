import { useState } from "react";
import { ArrowLeft, Upload, Check, Zap, TrendingUp, Target, Eye, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { SignalType } from "../types";

interface CreateSignalPageProps {
  onBack: () => void;
  onPublish: () => void;
}

const VALIDITY_OPTIONS = [
  { value: "5m", label: "5m" }, { value: "15m", label: "15m" }, { value: "30m", label: "30m" },
  { value: "1h", label: "1h" }, { value: "2h", label: "2h" }, { value: "3h", label: "3h" },
  { value: "4h", label: "4h" }, { value: "1d", label: "1d" }, { value: "2d", label: "2d" },
  { value: "3d", label: "3d" }, { value: "5d", label: "5d" }, { value: "1w", label: "1w" },
  { value: "2w", label: "2w" }, { value: "3w", label: "3w" }, { value: "1M", label: "1M" },
  { value: "2M", label: "2M" }, { value: "3M", label: "3M" }, { value: "6M", label: "6M" },
  { value: "1y", label: "1y" }, { value: "2y", label: "2y" }, { value: "3y", label: "3y" },
  { value: "5y", label: "5y" }, { value: "10y", label: "10y" }
];

const CATEGORIES = ["General", "Clancker", "Zora", "Base App", "NFT", "DeFi", "Crypto", "Pumping"];

export function CreateSignalPage({ onBack, onPublish }: CreateSignalPageProps) {
  const [selectedType, setSelectedType] = useState<SignalType | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({
    title: "",
    category: "",
    validity: "",
    price: "",
    imageUploaded: false
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onPublish();
      setSelectedType(null);
      setFormData({
        title: "",
        category: "",
        validity: "",
        price: "",
        imageUploaded: false
      });
    }, 1500);
  };

  const SIGNAL_TYPES: Record<SignalType, { label: string; icon: JSX.Element; extraFields: JSX.Element }> = {
    general: {
      label: "General",
      icon: <Sparkles className="h-5 w-5 text-[#00ffcc]" />,
      extraFields: (
        <>
          <FormField label="Market" value={formData.market || ""} onChange={(v) => handleChange("market", v)} placeholder="e.g., Farcaster Ecosystem" />
          <FormTextarea label="Description / Analysis" value={formData.description || ""} onChange={(v) => handleChange("description", v)} placeholder="Explain your insights..." rows={6} />
        </>
      )
    },
    signal: {
      label: "Quick Signal",
      icon: <Zap className="h-5 w-5 text-primary" />,
      extraFields: (
        <>
          <FormField label="Asset / Trading Pair" value={formData.asset || ""} onChange={(v) => handleChange("asset", v)} placeholder="e.g., BTC/USD" />
          <FormField label="Entry Point" value={formData.entryPoint || ""} onChange={(v) => handleChange("entryPoint", v)} placeholder="$42,000" />
          <FormField label="Take Profit 1" value={formData.takeProfit1 || ""} onChange={(v) => handleChange("takeProfit1", v)} placeholder="$45,000" />
          <FormField label="Take Profit 2 (Optional)" value={formData.takeProfit2 || ""} onChange={(v) => handleChange("takeProfit2", v)} placeholder="$48,000" />
          <FormField label="Stop Loss" value={formData.stopLoss || ""} onChange={(v) => handleChange("stopLoss", v)} placeholder="$40,000" />
          <FormTextarea label="Analysis & Interpretation" value={formData.analysis || ""} onChange={(v) => handleChange("analysis", v)} placeholder="Explain key indicators..." rows={6} />
        </>
      )
    },
    opportunity: {
      label: "Investment Opportunity",
      icon: <TrendingUp className="h-5 w-5 text-orange-400" />,
      extraFields: (
        <>
          <FormTextarea label="Asset Description" value={formData.assetDescription || ""} onChange={(v) => handleChange("assetDescription", v)} placeholder="Brief description..." rows={3} />
          <FormField label="Current Price" value={formData.currentPrice || ""} onChange={(v) => handleChange("currentPrice", v)} placeholder="$1.2 - $1.5" />
          <FormField label="Buy Range" value={formData.buyRange || ""} onChange={(v) => handleChange("buyRange", v)} placeholder="$1.0 - $1.3" />
          <FormTextarea label="Fundamentals" value={formData.fundamentals || ""} onChange={(v) => handleChange("fundamentals", v)} placeholder="Team, technology..." rows={4} />
          <FormTextarea label="Technicals" value={formData.technicals || ""} onChange={(v) => handleChange("technicals", v)} placeholder="Support/resistance..." rows={4} />
          <FormField label="Target Price" value={formData.targetPrice || ""} onChange={(v) => handleChange("targetPrice", v)} placeholder="$2.5 - $3.0" />
          <FormTextarea label="Risks" value={formData.risks || ""} onChange={(v) => handleChange("risks", v)} placeholder="Main risks..." rows={3} />
        </>
      )
    },
    strategy: {
      label: "Trading Strategy",
      icon: <Target className="h-5 w-5 text-blue-400" />,
      extraFields: (
        <>
          <FormTextarea label="Core Idea" value={formData.coreIdea || ""} onChange={(v) => handleChange("coreIdea", v)} placeholder="Main concept..." rows={3} />
          <FormField label="Market Type" value={formData.marketType || ""} onChange={(v) => handleChange("marketType", v)} placeholder="Crypto, Forex" />
          <FormTextarea label="Entry Conditions" value={formData.entryConditions || ""} onChange={(v) => handleChange("entryConditions", v)} placeholder="When to enter..." rows={4} />
          <FormTextarea label="Exit Conditions" value={formData.exitConditions || ""} onChange={(v) => handleChange("exitConditions", v)} placeholder="When to exit..." rows={4} />
          <FormTextarea label="Risk Management" value={formData.riskManagement || ""} onChange={(v) => handleChange("riskManagement", v)} placeholder="Stop loss rules..." rows={4} />
        </>
      )
    },
    foresight: {
      label: "Market Foresight",
      icon: <Eye className="h-5 w-5 text-purple-400" />,
      extraFields: (
        <>
          <FormField label="Target Market" value={formData.targetMarket || ""} onChange={(v) => handleChange("targetMarket", v)} placeholder="Crypto & Digital Assets" />
          <FormTextarea label="Macro Factors" value={formData.macroFactors || ""} onChange={(v) => handleChange("macroFactors", v)} placeholder="Economic trends..." rows={4} />
          <FormTextarea label="Innovation Trends" value={formData.innovationTrends || ""} onChange={(v) => handleChange("innovationTrends", v)} placeholder="Emerging tech..." rows={4} />
        </>
      )
    }
  };

  if (!selectedType) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <h2 className="text-foreground">Create Signal</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.entries(SIGNAL_TYPES).map(([type, info]) => (
            <Card key={type} className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all" onClick={() => setSelectedType(type as SignalType)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">{info.icon}</div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">{info.label}</h4>
                  <p className="text-xs text-muted-foreground">Fill out the {info.label} details</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const typeInfo = SIGNAL_TYPES[selectedType];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSelectedType(null)}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h2 className="text-foreground">{typeInfo.label}</h2>
          <p className="text-xs text-muted-foreground">Fill in the details</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <FormField label="Title" value={formData.title} onChange={(v) => handleChange("title", v)} placeholder={`Enter ${typeInfo.label} title`} />
        <FormSelect label="Category" value={formData.category} onChange={(v) => handleChange("category", v)} options={CATEGORIES} />
        {typeInfo.extraFields}
        <FormUpload label="Chart / Analysis Image" uploaded={formData.imageUploaded} onToggle={() => handleChange("imageUploaded", !formData.imageUploaded)} />
        <FormSelect label="Validity Period" value={formData.validity} onChange={(v) => handleChange("validity", v)} options={VALIDITY_OPTIONS.map(o => o.value)} />
        <FormField label="Signal Price (ETH)" type="number" value={formData.price} onChange={(v) => handleChange("price", v)} placeholder="0.02" />
        <Button onClick={handlePublish} className="w-full bg-primary hover:bg-primary/90 h-12" disabled={showSuccess}>
          {showSuccess ? (<span className="flex items-center gap-2"><Check className="h-5 w-5" /> Published Successfully!</span>) : "Publish Signal"}
        </Button>
      </div>
    </div>
  );
}

// Reusable components
const FormField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} className="bg-input-background border-border" />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder, rows = 4 }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="bg-input-background border-border resize-none" />
  </div>
);

const FormSelect = ({ label, value, onChange, options }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-input-background border-border"><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
      <SelectContent>{options.map((opt: any) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const FormUpload = ({ label, uploaded, onToggle }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20" onClick={onToggle}>
      {uploaded ? (
        <div className="flex flex-col items-center gap-2">
          <Check className="h-8 w-8 text-[#00ffcc]" />
          <p className="text-[#00ffcc]">Image uploaded</p>
          <p className="text-xs text-muted-foreground">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Upload chart image</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
      )}
    </div>
  </div>
);
