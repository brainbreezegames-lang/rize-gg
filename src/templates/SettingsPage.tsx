"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";
import { PageHeader, SettingsSidebar } from "@/components/layout";
import { TextInput, PasswordInput, Select, Toggle } from "@/components/forms";
import { Button } from "@/components/buttons";
import { Avatar } from "@/components/micro";
import { Divider } from "@/components/micro";

/**
 * @template SettingsPage
 * @description Full page layout for account settings.
 * Compose: Sidebar + TopBar + SettingsSidebar + Settings form
 */
export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: "Rize.gg", href: "/" },
                { label: "Settings" },
              ]}
            />
          }
        />
        <main className="flex-1 overflow-y-auto flex">
          <SettingsSidebar
            sections={[
              {
                title: "User Settings",
                items: [
                  { label: "My Account", active: true },
                  { label: "Profile" },
                  { label: "Privacy & Safety" },
                  { label: "Linked Accounts" },
                ],
              },
              {
                title: "Platform Settings",
                items: [
                  { label: "Notifications" },
                  { label: "Appearance" },
                  { label: "Language & Region" },
                ],
              },
            ]}
          />
          <div className="flex-1 px-8 py-8 flex flex-col gap-8 max-w-2xl">
            <PageHeader title="My Account" />

            {/* Profile section */}
            <div className="flex items-center gap-4">
              <Avatar size="xl" />
              <div className="flex flex-col gap-2">
                <span className="text-text-primary font-medium">MohTarek</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Divider />

            {/* Account info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Username" defaultValue="MohTarek" />
                <TextInput label="Email" defaultValue="Trk20@gmail.com" />
                <TextInput label="Display Name" defaultValue="MohTarek" />
                <Select
                  label="Region"
                  options={[
                    { value: "sa", label: "Saudi Arabia" },
                    { value: "uae", label: "UAE" },
                    { value: "eg", label: "Egypt" },
                  ]}
                />
              </div>
            </div>

            <Divider />

            {/* Password */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary">Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordInput label="Current Password" placeholder="Enter current password" />
                <PasswordInput label="New Password" placeholder="Enter new password" />
              </div>
              <div>
                <Button size="sm">Update Password</Button>
              </div>
            </div>

            <Divider />

            {/* Notifications */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                label="Push notifications"
              />
              <Toggle
                checked={emailUpdates}
                onChange={setEmailUpdates}
                label="Email updates"
              />
            </div>

            <Divider />

            {/* Danger zone */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
              <p className="text-sm text-text-secondary">
                Once you delete your account, there is no going back.
              </p>
              <div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
