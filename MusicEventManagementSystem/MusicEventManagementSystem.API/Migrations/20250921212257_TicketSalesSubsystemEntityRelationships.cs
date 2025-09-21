using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class TicketSalesSubsystemEntityRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SegmentId",
                table: "Zones",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "TicketTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "TicketTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RecordedSaleId",
                table: "Tickets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TicketTypeId",
                table: "Tickets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VenueId",
                table: "Segments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "RecordedSales",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PricingRuleId",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PricingRuleTicketType",
                columns: table => new
                {
                    PricingRulesPricingRuleId = table.Column<int>(type: "integer", nullable: false),
                    TicketTypesTicketTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingRuleTicketType", x => new { x.PricingRulesPricingRuleId, x.TicketTypesTicketTypeId });
                    table.ForeignKey(
                        name: "FK_PricingRuleTicketType_PricingRules_PricingRulesPricingRuleId",
                        column: x => x.PricingRulesPricingRuleId,
                        principalTable: "PricingRules",
                        principalColumn: "PricingRuleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PricingRuleTicketType_TicketTypes_TicketTypesTicketTypeId",
                        column: x => x.TicketTypesTicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "TicketTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecordedSaleSpecialOffer",
                columns: table => new
                {
                    RecordedSalesRecordedSaleId = table.Column<int>(type: "integer", nullable: false),
                    SpecialOffersSpecialOfferId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordedSaleSpecialOffer", x => new { x.RecordedSalesRecordedSaleId, x.SpecialOffersSpecialOfferId });
                    table.ForeignKey(
                        name: "FK_RecordedSaleSpecialOffer_RecordedSales_RecordedSalesRecorde~",
                        column: x => x.RecordedSalesRecordedSaleId,
                        principalTable: "RecordedSales",
                        principalColumn: "RecordedSaleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecordedSaleSpecialOffer_SpecialOffers_SpecialOffersSpecial~",
                        column: x => x.SpecialOffersSpecialOfferId,
                        principalTable: "SpecialOffers",
                        principalColumn: "SpecialOfferId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecialOfferTicketType",
                columns: table => new
                {
                    SpecialOffersSpecialOfferId = table.Column<int>(type: "integer", nullable: false),
                    TicketTypesTicketTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialOfferTicketType", x => new { x.SpecialOffersSpecialOfferId, x.TicketTypesTicketTypeId });
                    table.ForeignKey(
                        name: "FK_SpecialOfferTicketType_SpecialOffers_SpecialOffersSpecialOf~",
                        column: x => x.SpecialOffersSpecialOfferId,
                        principalTable: "SpecialOffers",
                        principalColumn: "SpecialOfferId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecialOfferTicketType_TicketTypes_TicketTypesTicketTypeId",
                        column: x => x.TicketTypesTicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "TicketTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Zones_SegmentId",
                table: "Zones",
                column: "SegmentId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_EventId",
                table: "TicketTypes",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_ZoneId",
                table: "TicketTypes",
                column: "ZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_RecordedSaleId",
                table: "Tickets",
                column: "RecordedSaleId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Segments_VenueId",
                table: "Segments",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordedSales_ApplicationUserId",
                table: "RecordedSales",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_PricingRuleId",
                table: "Events",
                column: "PricingRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingRuleTicketType_TicketTypesTicketTypeId",
                table: "PricingRuleTicketType",
                column: "TicketTypesTicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordedSaleSpecialOffer_SpecialOffersSpecialOfferId",
                table: "RecordedSaleSpecialOffer",
                column: "SpecialOffersSpecialOfferId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialOfferTicketType_TicketTypesTicketTypeId",
                table: "SpecialOfferTicketType",
                column: "TicketTypesTicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_PricingRules_PricingRuleId",
                table: "Events",
                column: "PricingRuleId",
                principalTable: "PricingRules",
                principalColumn: "PricingRuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordedSales_AspNetUsers_ApplicationUserId",
                table: "RecordedSales",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Segments_Venues_VenueId",
                table: "Segments",
                column: "VenueId",
                principalTable: "Venues",
                principalColumn: "VenueId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_RecordedSales_RecordedSaleId",
                table: "Tickets",
                column: "RecordedSaleId",
                principalTable: "RecordedSales",
                principalColumn: "RecordedSaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_TicketTypes_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId",
                principalTable: "TicketTypes",
                principalColumn: "TicketTypeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Events_EventId",
                table: "TicketTypes",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Zones_ZoneId",
                table: "TicketTypes",
                column: "ZoneId",
                principalTable: "Zones",
                principalColumn: "ZoneId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Segments_SegmentId",
                table: "Zones",
                column: "SegmentId",
                principalTable: "Segments",
                principalColumn: "SegmentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_PricingRules_PricingRuleId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_RecordedSales_AspNetUsers_ApplicationUserId",
                table: "RecordedSales");

            migrationBuilder.DropForeignKey(
                name: "FK_Segments_Venues_VenueId",
                table: "Segments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_RecordedSales_RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_TicketTypes_TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Events_EventId",
                table: "TicketTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Zones_ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Segments_SegmentId",
                table: "Zones");

            migrationBuilder.DropTable(
                name: "PricingRuleTicketType");

            migrationBuilder.DropTable(
                name: "RecordedSaleSpecialOffer");

            migrationBuilder.DropTable(
                name: "SpecialOfferTicketType");

            migrationBuilder.DropIndex(
                name: "IX_Zones_SegmentId",
                table: "Zones");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_EventId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Segments_VenueId",
                table: "Segments");

            migrationBuilder.DropIndex(
                name: "IX_RecordedSales_ApplicationUserId",
                table: "RecordedSales");

            migrationBuilder.DropIndex(
                name: "IX_Events_PricingRuleId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "SegmentId",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Segments");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "RecordedSales");

            migrationBuilder.DropColumn(
                name: "PricingRuleId",
                table: "Events");
        }
    }
}
