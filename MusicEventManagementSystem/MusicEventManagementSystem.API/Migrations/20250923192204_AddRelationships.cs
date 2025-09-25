using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PhaseId",
                table: "Requirements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ContractId",
                table: "Phases",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NegotiationId",
                table: "Phases",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Negotiations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PerformerId",
                table: "Negotiations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NegotiationId",
                table: "Documents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PerformerId",
                table: "Contracts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NegotiationId",
                table: "Communications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "NegotiationUsers",
                columns: table => new
                {
                    NegotiationId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NegotiationUsers", x => new { x.NegotiationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_NegotiationUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NegotiationUsers_Negotiations_NegotiationId",
                        column: x => x.NegotiationId,
                        principalTable: "Negotiations",
                        principalColumn: "NegotiationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requirements_PhaseId",
                table: "Requirements",
                column: "PhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Phases_ContractId",
                table: "Phases",
                column: "ContractId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Phases_NegotiationId",
                table: "Phases",
                column: "NegotiationId");

            migrationBuilder.CreateIndex(
                name: "IX_Negotiations_EventId",
                table: "Negotiations",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Negotiations_PerformerId",
                table: "Negotiations",
                column: "PerformerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_NegotiationId",
                table: "Documents",
                column: "NegotiationId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_PerformerId",
                table: "Contracts",
                column: "PerformerId");

            migrationBuilder.CreateIndex(
                name: "IX_Communications_NegotiationId",
                table: "Communications",
                column: "NegotiationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NegotiationUsers_UserId",
                table: "NegotiationUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Communications_Negotiations_NegotiationId",
                table: "Communications",
                column: "NegotiationId",
                principalTable: "Negotiations",
                principalColumn: "NegotiationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Performers_PerformerId",
                table: "Contracts",
                column: "PerformerId",
                principalTable: "Performers",
                principalColumn: "PerformerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Negotiations_NegotiationId",
                table: "Documents",
                column: "NegotiationId",
                principalTable: "Negotiations",
                principalColumn: "NegotiationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Negotiations_Events_EventId",
                table: "Negotiations",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Negotiations_Performers_PerformerId",
                table: "Negotiations",
                column: "PerformerId",
                principalTable: "Performers",
                principalColumn: "PerformerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Phases_Contracts_ContractId",
                table: "Phases",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "ContractId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Phases_Negotiations_NegotiationId",
                table: "Phases",
                column: "NegotiationId",
                principalTable: "Negotiations",
                principalColumn: "NegotiationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requirements_Phases_PhaseId",
                table: "Requirements",
                column: "PhaseId",
                principalTable: "Phases",
                principalColumn: "PhaseId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Communications_Negotiations_NegotiationId",
                table: "Communications");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Performers_PerformerId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Negotiations_NegotiationId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Negotiations_Events_EventId",
                table: "Negotiations");

            migrationBuilder.DropForeignKey(
                name: "FK_Negotiations_Performers_PerformerId",
                table: "Negotiations");

            migrationBuilder.DropForeignKey(
                name: "FK_Phases_Contracts_ContractId",
                table: "Phases");

            migrationBuilder.DropForeignKey(
                name: "FK_Phases_Negotiations_NegotiationId",
                table: "Phases");

            migrationBuilder.DropForeignKey(
                name: "FK_Requirements_Phases_PhaseId",
                table: "Requirements");

            migrationBuilder.DropTable(
                name: "NegotiationUsers");

            migrationBuilder.DropIndex(
                name: "IX_Requirements_PhaseId",
                table: "Requirements");

            migrationBuilder.DropIndex(
                name: "IX_Phases_ContractId",
                table: "Phases");

            migrationBuilder.DropIndex(
                name: "IX_Phases_NegotiationId",
                table: "Phases");

            migrationBuilder.DropIndex(
                name: "IX_Negotiations_EventId",
                table: "Negotiations");

            migrationBuilder.DropIndex(
                name: "IX_Negotiations_PerformerId",
                table: "Negotiations");

            migrationBuilder.DropIndex(
                name: "IX_Documents_NegotiationId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_PerformerId",
                table: "Contracts");

            migrationBuilder.DropIndex(
                name: "IX_Communications_NegotiationId",
                table: "Communications");

            migrationBuilder.DropColumn(
                name: "PhaseId",
                table: "Requirements");

            migrationBuilder.DropColumn(
                name: "ContractId",
                table: "Phases");

            migrationBuilder.DropColumn(
                name: "NegotiationId",
                table: "Phases");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Negotiations");

            migrationBuilder.DropColumn(
                name: "PerformerId",
                table: "Negotiations");

            migrationBuilder.DropColumn(
                name: "NegotiationId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "PerformerId",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "NegotiationId",
                table: "Communications");
        }
    }
}
