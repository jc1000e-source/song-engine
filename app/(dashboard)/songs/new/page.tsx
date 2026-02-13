import React from 'react';

export default function NewSongPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-3xl font-bold">Generate a New Song</h1>
      <p className="text-muted-foreground">
        This is the song generation page. You can add your form here.
      </p>
      
      {/* Placeholder for your form */}
      <div className="p-6 border rounded-lg shadow-sm bg-card max-w-md w-full">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Song Title</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter title..." />
          </div>
          <button className="w-full bg-primary text-primary-foreground p-2 rounded-md font-medium">
            Create Song
          </button>
        </div>
      </div>
    </div>
  );
}