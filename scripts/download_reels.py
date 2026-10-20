#!/usr/bin/env python3
"""
Instagram Reel Downloader for Astro

Usage:
    python3 download_reels.py --username tomma.artist

Requirements:
    pip install instaloader
"""

import instaloader
import os
import argparse
from datetime import datetime

def download_reels(username, output_dir="public/images/reels", content_dir="src/content/art"):
    # Create directories
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(content_dir, exist_ok=True)
    
    # Initialize instaloader
    L = instaloader.Instaloader()
    
    # Load session from file
    session_path = os.path.expanduser(f"~/.config/instaloader/session-{username}")
    if os.path.exists(session_path):
        L.load_session_from_file(username)
        print(f"Loaded session for {username}")
    else:
        print(f"No session found. Run: instaloader --login={username}")
        return
    
    # Get profile
    profile = instaloader.Profile.from_username(L.context, username)
    print(f"Found @{username} - {profile.mediacount} posts")
    
    print(f"Fetching reels from @{username}...")
    
    count = 0
    for post in profile.get_posts():
        if post.is_video:
            # Get the shortcode
            shortcode = post.shortcode
            date_str = post.date.strftime("%Y-%m-%d")
            
            # Thumbnail filename
            thumb_filename = f"reel-{date_str}-{shortcode}.jpg"
            thumb_path = os.path.join(output_dir, thumb_filename)
            
            # Download thumbnail
            if not os.path.exists(thumb_path):
                print(f"Downloading: {thumb_filename}")
                L.download_pic(thumb_path, post.url, post.date)
            
            # Create markdown file
            md_filename = f"reel-{shortcode}.md"
            md_path = os.path.join(content_dir, md_filename)
            
            if not os.path.exists(md_path):
                title = post.title if post.title else f"reel_{date_str}"
                title = title[:50]  # limit length
                
                md_content = f"""---
title: "{title}"
videoUrl: "https://www.instagram.com/reel/{shortcode}/"
thumbnail: "/images/reels/{thumb_filename}"
date: "{date_str}"
---

{post.caption[:200] if post.caption else ''}
"""
                
                with open(md_path, 'w') as f:
                    f.write(md_content)
                
                print(f"Created: {md_filename}")
                count += 1
        
        if count >= 20:  # limit to 20 most recent
            break
    
    print(f"\nDone! Downloaded {count} reels.")
    print(f"Thumbnails: {output_dir}/")
    print(f"Markdown files: {content_dir}/")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download Instagram reels")
    parser.add_argument("--username", default="tomma.artist", help="Instagram username")
    args = parser.parse_args()
    
    download_reels(args.username)