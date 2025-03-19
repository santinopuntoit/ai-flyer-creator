"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { validateApiConnection } from "@/lib/replicate";

export function ApiTokenConfig() {
  const [token, setToken] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');

  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem("replicate_token");
      if (!storedToken) {
        setTokenStatus('unchecked');
        return;
      }

      setToken(storedToken);
      setIsValidating(true);
      try {
        const isValid = await validateApiConnection(storedToken);
        setTokenStatus(isValid ? 'valid' : 'invalid');
        if (!isValid) {
          localStorage.removeItem("replicate_token");
          console.error("Stored API token is invalid");
        }
      } catch (error) {
        console.error("Error validating stored token:", error);
        setTokenStatus('invalid');
        localStorage.removeItem("replicate_token");
      } finally {
        setIsValidating(false);
      }
    };

    validateStoredToken();
  }, []);

  const saveToken = async () => {
    if (!token.trim()) {
      toast.error("Please enter a valid API token");
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateApiConnection(token);
      
      if (isValid) {
        localStorage.setItem("replicate_token", token);
        window.dispatchEvent(new Event("replicate_token_updated"));
        setTokenStatus('valid');
        setIsOpen(false);
        toast.success("API token validated and saved successfully");
      } else {
        setTokenStatus('invalid');
        toast.error("Invalid API token. Please check your token and try again.");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setTokenStatus('invalid');
      toast.error("Failed to validate API token. Please check your connection and try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusColor = () => {
    switch (tokenStatus) {
      case 'valid':
        return "text-green-500";
      case 'invalid':
        return "text-red-500";
      default:
        return "text-white/60";
    }
  };

  const getStatusIcon = () => {
    switch (tokenStatus) {
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-white/60" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-black/40 border-white/10 text-white/80 hover:bg-white/10 flex items-center gap-2"
        >
          {getStatusIcon()}
          Configure API Token
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Replicate API Token Configuration</DialogTitle>
          <DialogDescription className="text-white/60">
            <p className="mb-4">
              To use the AI Flyer Creator, you need a Replicate API token. Follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>Go to <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline inline-flex items-center">
                replicate.com
                <ExternalLink className="h-3 w-3 ml-1" />
              </a></li>
              <li>Sign up or log in to your account</li>
              <li>Go to <a href="https://replicate.com/account" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline inline-flex items-center">
                Account Settings
                <ExternalLink className="h-3 w-3 ml-1" />
              </a></li>
              <li>Copy your API token</li>
            </ol>
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span>
                  {tokenStatus === 'valid' && "Token is valid"}
                  {tokenStatus === 'invalid' && "Token is invalid"}
                  {tokenStatus === 'unchecked' && "Token not configured"}
                </span>
              </div>
            </div>
            <p className="text-sm">
              Your token will be stored securely in your browser&apos;s local storage.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder="Enter your Replicate API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-black/40 border-white/10"
          />
          <Button
            onClick={saveToken}
            disabled={isValidating}
            className="w-full bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 relative"
          >
            {isValidating ? (
              <>
                <span className="opacity-0">Save Token</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              </>
            ) : (
              "Save Token"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}