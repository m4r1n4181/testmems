using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class EventManagementSubsysteChanges1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Resources_ResourceId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Locations_LocationId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Infrastructures_Resources_ResourceId",
                table: "Infrastructures");

            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceResources_Performances_PerformanceId",
                table: "PerformanceResources");

            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceResources_Resources_ResourceId",
                table: "PerformanceResources");

            migrationBuilder.DropForeignKey(
                name: "FK_Performances_Events_EventId",
                table: "Performances");

            migrationBuilder.DropForeignKey(
                name: "FK_Performances_Performers_PerformerId",
                table: "Performances");

            migrationBuilder.DropForeignKey(
                name: "FK_Performances_Venues_VenueId",
                table: "Performances");

            migrationBuilder.DropForeignKey(
                name: "FK_Services_Resources_ResourceId",
                table: "Services");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Resources_ResourceId",
                table: "Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Resources_ResourceId",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkTasks_Performances_PerformanceId",
                table: "WorkTasks");

            migrationBuilder.DropIndex(
                name: "IX_WorkTasks_PerformanceId",
                table: "WorkTasks");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_ResourceId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Staff_ResourceId",
                table: "Staff");

            migrationBuilder.DropIndex(
                name: "IX_Services_ResourceId",
                table: "Services");

            migrationBuilder.DropIndex(
                name: "IX_Performances_EventId",
                table: "Performances");

            migrationBuilder.DropIndex(
                name: "IX_Performances_PerformerId",
                table: "Performances");

            migrationBuilder.DropIndex(
                name: "IX_Performances_VenueId",
                table: "Performances");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceResources_PerformanceId",
                table: "PerformanceResources");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceResources_ResourceId",
                table: "PerformanceResources");

            migrationBuilder.DropIndex(
                name: "IX_Infrastructures_ResourceId",
                table: "Infrastructures");

            migrationBuilder.DropIndex(
                name: "IX_Events_LocationId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Equipment_ResourceId",
                table: "Equipment");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Vehicles",
                newName: "VehicleType");

            //migrationBuilder.AlterColumn<Guid>(
            //    name: "CreatedById",
            //    table: "Events",
            //    type: "uuid",
            //    nullable: false,
            //    oldClrType: typeof(int),
            //    oldType: "integer");

            migrationBuilder.Sql(
                @"ALTER TABLE ""Events"" 
                  ALTER COLUMN ""CreatedById"" TYPE uuid 
                  USING gen_random_uuid();"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VehicleType",
                table: "Vehicles",
                newName: "Type");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedById",
                table: "Events",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTasks_PerformanceId",
                table: "WorkTasks",
                column: "PerformanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_ResourceId",
                table: "Vehicles",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_ResourceId",
                table: "Staff",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_ResourceId",
                table: "Services",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Performances_EventId",
                table: "Performances",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Performances_PerformerId",
                table: "Performances",
                column: "PerformerId");

            migrationBuilder.CreateIndex(
                name: "IX_Performances_VenueId",
                table: "Performances",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceResources_PerformanceId",
                table: "PerformanceResources",
                column: "PerformanceId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceResources_ResourceId",
                table: "PerformanceResources",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Infrastructures_ResourceId",
                table: "Infrastructures",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_LocationId",
                table: "Events",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_ResourceId",
                table: "Equipment",
                column: "ResourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Resources_ResourceId",
                table: "Equipment",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Locations_LocationId",
                table: "Events",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Infrastructures_Resources_ResourceId",
                table: "Infrastructures",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceResources_Performances_PerformanceId",
                table: "PerformanceResources",
                column: "PerformanceId",
                principalTable: "Performances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceResources_Resources_ResourceId",
                table: "PerformanceResources",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Performances_Events_EventId",
                table: "Performances",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Performances_Performers_PerformerId",
                table: "Performances",
                column: "PerformerId",
                principalTable: "Performers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Performances_Venues_VenueId",
                table: "Performances",
                column: "VenueId",
                principalTable: "Venues",
                principalColumn: "VenueId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Resources_ResourceId",
                table: "Services",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Resources_ResourceId",
                table: "Staff",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Resources_ResourceId",
                table: "Vehicles",
                column: "ResourceId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkTasks_Performances_PerformanceId",
                table: "WorkTasks",
                column: "PerformanceId",
                principalTable: "Performances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
