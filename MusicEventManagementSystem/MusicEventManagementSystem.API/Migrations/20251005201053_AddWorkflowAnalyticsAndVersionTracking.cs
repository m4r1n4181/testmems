using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkflowAnalyticsAndVersionTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MediaVersions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "MediaTaskId",
                table: "MediaVersions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedForApprovalAt",
                table: "MediaTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TaskCompletedAt",
                table: "MediaTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TaskStartedAt",
                table: "MediaTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubmittedMediaVersionId",
                table: "Approvals",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MediaVersions_MediaTaskId",
                table: "MediaVersions",
                column: "MediaTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_SubmittedMediaVersionId",
                table: "Approvals",
                column: "SubmittedMediaVersionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Approvals_MediaVersions_SubmittedMediaVersionId",
                table: "Approvals",
                column: "SubmittedMediaVersionId",
                principalTable: "MediaVersions",
                principalColumn: "MediaVersionId");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaVersions_MediaTasks_MediaTaskId",
                table: "MediaVersions",
                column: "MediaTaskId",
                principalTable: "MediaTasks",
                principalColumn: "MediaTaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Approvals_MediaVersions_SubmittedMediaVersionId",
                table: "Approvals");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaVersions_MediaTasks_MediaTaskId",
                table: "MediaVersions");

            migrationBuilder.DropIndex(
                name: "IX_MediaVersions_MediaTaskId",
                table: "MediaVersions");

            migrationBuilder.DropIndex(
                name: "IX_Approvals_SubmittedMediaVersionId",
                table: "Approvals");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "MediaVersions");

            migrationBuilder.DropColumn(
                name: "MediaTaskId",
                table: "MediaVersions");

            migrationBuilder.DropColumn(
                name: "SubmittedForApprovalAt",
                table: "MediaTasks");

            migrationBuilder.DropColumn(
                name: "TaskCompletedAt",
                table: "MediaTasks");

            migrationBuilder.DropColumn(
                name: "TaskStartedAt",
                table: "MediaTasks");

            migrationBuilder.DropColumn(
                name: "SubmittedMediaVersionId",
                table: "Approvals");
        }
    }
}
