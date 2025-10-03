# Media Task Approval Workflow Documentation

## Overview
This document describes the complete approval workflow for media tasks in the Music Event Management System.

## Workflow Steps

### 1. View Task List
- Navigate to **My Tasks** page (`/media-campaign/mytasks`)
- Tasks are displayed in order (sorted by `order` field)
- Only the first unapproved task is unlocked for editing
- Subsequent tasks remain locked until all previous tasks are approved

### 2. Edit Task and Upload Media
- Click **View Task** on an unlocked task
- Upload a media file using the file upload area
- Click **Save Draft** to create a new version
  - This creates a `MediaVersion` record in the backend
  - Version appears immediately in the sidebar
  - Multiple versions can be saved

### 3. Mark Version as Final
- Select a version from the sidebar
- Click **Mark as Final** to designate it as the submission candidate
- Only one version should be marked as final before submission

### 4. Submit to Approval
- Once a final version exists, the **Submit to Approval** button becomes enabled
- Click **Submit to Approval** which:
  - Updates task status to `PendingApproval`
  - Creates an `Approval` record in the backend
  - Links the approval ID to the media task
  - Automatically navigates to the approval page

### 5. Review and Approve/Reject
- Manager/Approver views the approval page (`/approval/{approvalId}`)
- Can see:
  - Media preview (image/video)
  - Campaign details
  - Channel/Ad Type
  - Scheduled publication date
- Options:
  - **Approve**: 
    - Updates approval status to `Approved`
    - Updates task status to `Approved`
    - Unlocks the next task in sequence
    - Navigates back to task list
  - **Reject**:
    - Updates approval status to `Denied`
    - Updates task status to `Rejected`
    - User must rework and resubmit
    - Navigates back to task list

### 6. Next Task Unlocking
- When a task is approved, the next task (by order) becomes unlocked
- Users can then view and work on the next task
- Process repeats for all tasks in sequence

## Technical Details

### API Endpoints Used

#### MediaTask
- `GET /api/MediaTask/managerId/{managerId}` - Get tasks for user
- `PUT /api/MediaTask/{id}` - Update task status

#### Approval
- `POST /api/Approval` - Create approval request
- `GET /api/Approval/{id}` - Get approval details
- `PUT /api/Approval/{id}` - Update approval status

#### MediaVersion
- `POST /api/MediaVersion` - Create new version
- `GET /api/MediaVersion/adId/{adId}` - Get versions for ad
- `PUT /api/MediaVersion/{id}` - Mark version as final

### Task Statuses
- `InPreparation` - Initial state, user is working on task
- `PendingApproval` - Submitted for approval, awaiting review
- `Approved` - Approved by manager, next task unlocked
- `Rejected` - Rejected by manager, needs rework

### Approval Statuses
- `Pending` - Awaiting approval decision
- `Approved` - Approved by manager
- `Denied` - Rejected by manager

## UI Components

### MyTasks.tsx
- Displays task list with status indicators
- Implements unlocking logic
- Provides task editing interface
- Handles version management
- Submit to approval functionality

### Approval.tsx
- Displays approval request details
- Shows media preview
- Provides approve/reject actions
- Fetches related data (campaign, ad type)
- Updates task and approval status

## Error Handling
- All API calls are wrapped in try-catch blocks
- User-friendly alerts displayed on errors
- Failed operations don't leave data in inconsistent state
- Navigation only occurs after successful operations

## Validation Rules
1. At least one version must be marked as final before submission
2. Tasks must be completed in order
3. Cannot view locked tasks until previous tasks are approved
4. All status updates are persisted to backend immediately
