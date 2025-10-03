# Testing Guide for MediaWorkflow and MediaTask Relationship

## Prerequisites
- PostgreSQL database running on localhost:5432
- Database name: MEMSDB
- Username: postgres
- Password: root
- Backend API running on http://localhost:5255
- Frontend running (typically on http://localhost:5173 with Vite)

## Backend Testing

### 1. Start the Backend API
```bash
cd MusicEventManagementSystem
dotnet run --project MusicEventManagementSystem.API
```

### 2. Test Workflow Creation with Tasks (POST)
**Endpoint:** `POST http://localhost:5255/api/MediaWorkflow`

**Request Body:**
```json
{
  "workflowDescription": "Social Media Campaign Workflow",
  "tasks": [
    {
      "taskName": "Design Visual",
      "order": 1,
      "taskStatus": "pending"
    },
    {
      "taskName": "Write Copy",
      "order": 2,
      "taskStatus": "pending"
    },
    {
      "taskName": "Review and Approve",
      "order": 3,
      "taskStatus": "pending"
    }
  ],
  "approvalId": null
}
```

**Expected Response:** 201 Created
```json
{
  "mediaWorkflowId": 1,
  "workflowDescription": "Social Media Campaign Workflow",
  "taskIds": [1, 2, 3],
  "tasks": [
    {
      "mediaTaskId": 1,
      "taskName": "Design Visual",
      "order": 1,
      "taskStatus": "pending",
      "workflowId": 1,
      ...
    },
    {
      "mediaTaskId": 2,
      "taskName": "Write Copy",
      "order": 2,
      "taskStatus": "pending",
      "workflowId": 1,
      ...
    },
    {
      "mediaTaskId": 3,
      "taskName": "Review and Approve",
      "order": 3,
      "taskStatus": "pending",
      "workflowId": 1,
      ...
    }
  ],
  "approvalId": null,
  "adId": null
}
```

**What to Verify:**
- ✅ Workflow is created with generated `mediaWorkflowId`
- ✅ All tasks are created with proper `workflowId` (matching the workflow's ID)
- ✅ Each task has a unique `mediaTaskId`
- ✅ Task order is preserved
- ✅ Both `taskIds` array and full `tasks` array are returned

### 3. Test Workflow Retrieval (GET)
**Endpoint:** `GET http://localhost:5255/api/MediaWorkflow/1`

**Expected Response:** 200 OK with workflow and all its tasks included

**What to Verify:**
- ✅ Workflow data is complete
- ✅ All tasks are included in the response
- ✅ Task relationships are correct (workflowId matches)

### 4. Test Workflow Update with Tasks (PUT)
**Endpoint:** `PUT http://localhost:5255/api/MediaWorkflow/1`

**Request Body:**
```json
{
  "workflowDescription": "Updated Social Media Campaign Workflow",
  "tasks": [
    {
      "taskName": "Design Visual v2",
      "order": 1,
      "taskStatus": "completed"
    },
    {
      "taskName": "Write Copy v2",
      "order": 2,
      "taskStatus": "in_progress"
    },
    {
      "taskName": "Schedule Posts",
      "order": 3,
      "taskStatus": "pending"
    },
    {
      "taskName": "Track Analytics",
      "order": 4,
      "taskStatus": "pending"
    }
  ]
}
```

**Expected Response:** 200 OK with updated workflow

**What to Verify:**
- ✅ Old tasks are removed (tasks 1, 2, 3 from creation are deleted)
- ✅ New tasks are created with new IDs
- ✅ All new tasks have correct `workflowId`
- ✅ Workflow description is updated
- ✅ Task count changed from 3 to 4

### 5. Test Workflow Deletion (DELETE)
**Endpoint:** `DELETE http://localhost:5255/api/MediaWorkflow/1`

**Expected Response:** 204 No Content

**What to Verify:**
- ✅ Workflow is deleted
- ✅ All associated tasks are cascade deleted
- ✅ Subsequent GET returns 404 Not Found

### 6. Test Creating Workflow Without Tasks
**Endpoint:** `POST http://localhost:5255/api/MediaWorkflow`

**Request Body:**
```json
{
  "workflowDescription": "Empty Workflow",
  "tasks": []
}
```

**Expected Response:** 201 Created
- ✅ Workflow is created
- ✅ `tasks` array is empty
- ✅ `taskIds` array is empty

## Frontend Testing

### 1. Start the Frontend
```bash
cd MusicEventManagementSystem/MusicEventManagementSystem.Client
npm install
npm run dev
```

### 2. Navigate to Workflows Page
- Open browser to frontend URL (typically http://localhost:5173)
- Navigate to Media Campaign → Workflows section

### 3. Test Create New Workflow
**Steps:**
1. Click "Create New Workflow" button
2. Enter workflow name/description
3. Add/edit tasks in the task list
   - Default tasks should be pre-filled
   - You can add more tasks
   - You can edit task names and descriptions
   - You can delete tasks
   - You can reorder tasks
4. Click "Create Workflow" button

**Expected Behavior:**
- ✅ Success message appears: "Workflow and tasks created successfully!"
- ✅ Modal closes
- ✅ New workflow appears in the workflow list
- ✅ Workflow shows correct task count

### 4. Test View Workflow Details
**Steps:**
1. Click "View" (eye icon) on a workflow
2. View should show:
   - Workflow name/description
   - List of all tasks with their details
   - Task order

**Expected Behavior:**
- ✅ Workflow details load correctly
- ✅ All tasks are displayed
- ✅ Tasks are shown in the correct order

### 5. Test Edit Workflow
**Steps:**
1. Click "View" on a workflow
2. Edit workflow name
3. Add new tasks
4. Edit existing tasks
5. Delete some tasks
6. Click "Save Changes"

**Expected Behavior:**
- ✅ Success message: "Workflow and tasks updated successfully!"
- ✅ Changes are persisted
- ✅ When viewing again, all changes are reflected
- ✅ Old tasks that were deleted are no longer shown
- ✅ New tasks appear with correct details

### 6. Test Delete Workflow
**Steps:**
1. Click "Delete" (trash icon) on a workflow
2. Confirm deletion in the dialog

**Expected Behavior:**
- ✅ Confirmation dialog appears
- ✅ After confirmation, success message appears
- ✅ Workflow disappears from the list
- ✅ All tasks associated with the workflow are deleted

## Error Cases to Test

### 1. Missing Required Fields
**Test:** Try to create a workflow with a task that has no `taskName`

**Backend Request:**
```json
{
  "workflowDescription": "Test Workflow",
  "tasks": [
    {
      "taskName": "",
      "order": 1
    }
  ]
}
```

**Expected:** 400 Bad Request with validation error

### 2. Invalid Workflow ID for Update
**Test:** Try to update a workflow that doesn't exist

**Endpoint:** `PUT http://localhost:5255/api/MediaWorkflow/999999`

**Expected:** 404 Not Found

### 3. Invalid Workflow ID for Retrieval
**Test:** Try to get a workflow that doesn't exist

**Endpoint:** `GET http://localhost:5255/api/MediaWorkflow/999999`

**Expected:** 404 Not Found

## Database Verification

After running tests, verify the database state:

```sql
-- Check workflows
SELECT * FROM "MediaWorkflows";

-- Check tasks and their workflow relationships
SELECT 
    mt."MediaTaskId",
    mt."TaskName",
    mt."Order",
    mt."TaskStatus",
    mt."WorkflowId",
    mw."WorkflowDescription"
FROM "MediaTasks" mt
JOIN "MediaWorkflows" mw ON mt."WorkflowId" = mw."MediaWorkflowId"
ORDER BY mt."WorkflowId", mt."Order";

-- Verify cascade delete worked
-- After deleting a workflow, verify no orphaned tasks exist
SELECT * FROM "MediaTasks" WHERE "WorkflowId" = 1; -- Should return empty if workflow 1 was deleted
```

## Success Criteria

All tests pass if:
- ✅ Workflows can be created with multiple tasks in a single API call
- ✅ All tasks are properly linked to their workflow (correct WorkflowId)
- ✅ Workflows can be updated, adding/removing tasks
- ✅ Workflows can be deleted, cascading to tasks
- ✅ Frontend successfully creates, reads, updates, and deletes workflows
- ✅ No orphaned tasks remain after workflow deletion
- ✅ No database constraint violations occur
- ✅ Both backend and frontend build without errors
- ✅ API responses include both taskIds and full task objects

## Common Issues and Solutions

### Issue: Tasks created with WorkflowId = 0
**Symptom:** Tasks are created but have WorkflowId of 0, breaking the relationship

**Cause:** Trying to set WorkflowId before the workflow is saved

**Solution:** ✅ Fixed - EF Core now automatically sets WorkflowId when tasks are added to workflow.Tasks collection

### Issue: Validation error "WorkflowId is required"
**Symptom:** Cannot create workflow with tasks due to validation error

**Cause:** MediaTaskCreateDto had WorkflowId as required field

**Solution:** ✅ Fixed - WorkflowId is now optional in MediaTaskCreateDto

### Issue: Foreign key constraint error on Manager
**Symptom:** Cannot save task without ManagerId

**Cause:** DbContext marked Manager as required but model defines it as optional

**Solution:** ✅ Fixed - Manager relationship is now optional in DbContext configuration
