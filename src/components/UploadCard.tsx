'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileImage, AlertCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';

// This is a placeholder function to simulate ML model analysis
const analyzeCTScan = async (
  file: File
): Promise<{
  confidence: number;
  stage: 'normal' | 'benign' | 'malignant';
}> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time
  const randomConfidence = Math.random();
  const stages: Array<'normal' | 'benign' | 'malignant'> = [
    'normal',
    'benign',
    'malignant',
  ];
  const randomStage = stages[Math.floor(Math.random() * stages.length)];
  return { confidence: randomConfidence, stage: randomStage };
};

export default function UploadCard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    confidence: number;
    stage: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (selectedFile) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeCTScan(selectedFile);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing CT scan:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className='container m-auto min-h-screen flex flex-col items-center justify-center p-4 '>
      <Button
        onClick={() => {
          signOut({ redirect: true, callbackUrl: '/login' });
        }}
        className='absolute top-4 right-4'
      >
        Sign Out
      </Button>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Lung Cancer Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='ct-scan-upload'>Upload CT Scan Image</Label>
            <Input
              id='ct-scan-upload'
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='cursor-pointer'
            />
          </div>
          {previewUrl && (
            <div className='relative aspect-square w-full max-w-md mx-auto'>
              <Image
                src={previewUrl}
                alt='CT Scan Preview'
                fill
                className='object-cover rounded-md'
              />
            </div>
          )}
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span>Confidence:</span>
                  <Progress
                    value={analysis.confidence * 100}
                    className='w-2/3'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <span>Cancer Stage:</span>
                  <span
                    className={`font-semibold ${
                      analysis.stage === 'normal'
                        ? 'text-green-500'
                        : analysis.stage === 'benign'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {analysis.stage.charAt(0).toUpperCase() +
                      analysis.stage.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className='w-full'
          >
            {isAnalyzing ? (
              <>
                <AlertCircle className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                <FileImage className='mr-2 h-4 w-4' />
                Analyze CT Scan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
