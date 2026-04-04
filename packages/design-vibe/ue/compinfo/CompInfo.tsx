import React, { useState } from "react";
import { Card, Button, Icon, Tab, TabRow, ExpansionPanel } from "@my-google-project/gm3-react-components";

export const CompInfo: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showValues, setShowValues] = useState(false);

  // Helper to mask values
  const getValue = (val: string) => (showValues ? val : "•••••••");

  return (
    <Card
      variant="outlined"
      className={`w-full max-w-[600px] bg-surface p-0 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Icon className="text-on-primary">payments</Icon>
          </div>
          <div>
            <h2 className="title-large text-on-surface">
              Your total compensation
            </h2>
            <p className="body-medium text-on-surface-variant">
              Data from Prosper
            </p>
          </div>
        </div>
        <Button
          variant="filled"
          className="rounded-full !py-2 !bg-primary"
          onClick={() => setShowValues(!showValues)}
        >
          <Icon className="mr-2 text-on-primary">visibility</Icon>
          {showValues ? "Hide" : "Show"}
        </Button>
      </div>

      {/* Tabs */}
      <TabRow
        selectedTabIndex={selectedTab}
        onTabChange={setSelectedTab}
        className="border-b border-outline-variant"
        indicatorClassName="!bg-primary"
      >
        <Tab label="Granted equity value" />
        <Tab label="Vested equity value" />
      </TabRow>

      <div className="p-4 flex flex-col gap-2">
        {/* Total Compensation */}
        <div className="py-2">
          <p className="label-medium text-on-surface-variant">
            Your 2025 compensation
          </p>
          <div className="flex justify-between items-center mt-1">
            <span className="title-medium text-on-surface">Total (USD)</span>
            <span className="title-large text-on-surface font-medium tracking-wider">
              {getValue("$350,000")}
            </span>
          </div>
        </div>

        {/* Equity Section */}
        <ExpansionPanel
          title={
            <span className="title-medium text-on-surface">Equity (USD)</span>
          }
          headerActions={
            <div className="flex items-center gap-4">
              <span className="title-medium text-on-surface tracking-wider w-[120px] text-center">
                {getValue("$150,000")}
              </span>
              <Icon className="text-on-surface-variant">info</Icon>
            </div>
          }
          headerVariant="full-width"
          className="rounded-lg border border-outline-variant"
          hideBottomBorder
        >
          <div className="p-4 bg-surface-container-low flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="body-medium text-on-surface-variant">GSUs</span>
              <span className="body-medium text-on-surface">
                {getValue("$150,000")}
              </span>
            </div>
          </div>
        </ExpansionPanel>

        {/* Bonus Section */}
        <ExpansionPanel
          title={
            <span className="title-medium text-on-surface">Bonus (USD)</span>
          }
          headerActions={
            <div className="flex items-center gap-4">
              <span className="title-medium text-on-surface tracking-wider w-[120px] text-center">
                {getValue("$45,000")}
              </span>
              <Icon className="text-on-surface-variant">info</Icon>
            </div>
          }
          headerVariant="full-width"
          className="rounded-lg border border-outline-variant"
          hideBottomBorder
        >
          <div className="p-4 bg-surface-container-low flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="body-medium text-on-surface-variant">
                Target Bonus
              </span>
              <span className="body-medium text-on-surface">15%</span>
            </div>
          </div>
        </ExpansionPanel>

        {/* Salary Section (Static Row) */}
        <div className="flex justify-between items-center p-4 border border-outline-variant rounded-lg min-h-[56px]">
          <span className="title-medium text-on-surface pl-2">
            Salary (USD)
          </span>
          <div className="flex items-center gap-4 pr-[36px]">
            <span className="title-medium text-on-surface tracking-wider w-[120px] text-center">
              {getValue("$155,000")}
            </span>
            <Icon className="text-on-surface-variant">info</Icon>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 pt-2 flex gap-2">
        <Button variant="outlined">
          <Icon className="mr-2">open_in_new</Icon>
          Visit Prosper
        </Button>
        <Button variant="outlined">
          <Icon className="mr-2">open_in_new</Icon>
          View award letter
        </Button>
      </div>
    </Card>
  );
};
