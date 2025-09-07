using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MusicEventManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class IntegrationStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IntegrationStatuses",
                columns: table => new
                {
                    IntegrationStatusId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AdId = table.Column<int>(type: "integer", nullable: false),
                    ChannelId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    PublicationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Error = table.Column<string>(type: "text", nullable: true),
                    LastSynced = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MediaChannelId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationStatuses", x => x.IntegrationStatusId);
                    table.ForeignKey(
                        name: "FK_IntegrationStatuses_Ads_AdId",
                        column: x => x.AdId,
                        principalTable: "Ads",
                        principalColumn: "AdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IntegrationStatuses_Channels_MediaChannelId",
                        column: x => x.MediaChannelId,
                        principalTable: "Channels",
                        principalColumn: "MediaChannelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationStatuses_AdId",
                table: "IntegrationStatuses",
                column: "AdId");

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationStatuses_MediaChannelId",
                table: "IntegrationStatuses",
                column: "MediaChannelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IntegrationStatuses");
        }
    }
}
