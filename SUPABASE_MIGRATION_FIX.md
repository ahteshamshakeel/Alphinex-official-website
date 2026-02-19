# Supabase Migration Fix Guide

## Issue Found
Your project has 4 migrations ready to deploy:
1. `20260213152604_add_jobs_and_applications`
2. `20260213160928_add_contact_emails`
3. `20260216094037_add_projects`
4. `20260216122002_add_blogs`

## Problems Fixed
✅ Downgraded Prisma from 7.x to 5.22.0 (compatibility issue)
✅ Created `.env` file (Prisma CLI needs this)
✅ Generated Prisma Client

## Current Issue
❌ Cannot connect to Supabase database

## Steps to Fix Connection

### 1. Verify Supabase Project is Active
- Go to https://supabase.com/dashboard
- Check if your project is paused (free tier pauses after inactivity)
- If paused, click "Resume" or "Restore"

### 2. Get Fresh Database Connection String
- In Supabase Dashboard → Settings → Database
- Look for "Connection string" section
- Select "URI" format
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your actual database password: `Alphinex123`

### 3. Update Your .env File
Replace the DATABASE_URL with the fresh connection string:
```
DATABASE_URL="postgresql://postgres.fyicdojdmirjrzcjddfv:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Or use the direct connection (port 5432):
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.fyicdojdmirjrzcjddfv.supabase.co:5432/postgres"
```

### 4. Test Connection
```bash
npx prisma db pull
```

### 5. Deploy Migrations
Once connection works, run:
```bash
npx prisma migrate deploy
```

Or if you want to reset and apply all migrations:
```bash
npx prisma migrate reset
```

### 6. Seed Initial Data (Optional)
If you have a seed script:
```bash
npx prisma db seed
```

## Alternative: Use Supabase Studio
If CLI doesn't work, you can run migrations manually:
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from each migration file in `prisma/migrations/`
3. Run them in order

## Common Issues

### Issue: "Can't reach database server"
- Check if project is paused
- Verify password is correct
- Try direct connection (port 5432) instead of pooler (port 6543)
- Check firewall/antivirus blocking connection

### Issue: "Authentication failed"
- Password might be wrong
- Get new password from Supabase Dashboard → Settings → Database → Reset Password

### Issue: "SSL connection required"
- Add `?sslmode=require` to connection string

## Need Help?
Run these commands to get more info:
```bash
# Check Prisma version
npx prisma --version

# Check migration status
npx prisma migrate status

# View schema
npx prisma studio
```
