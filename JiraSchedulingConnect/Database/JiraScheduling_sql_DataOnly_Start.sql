USE [WoTaas]
GO
INSERT [dbo].[plan_subscription] ([id], [name], [price], [duration], [create_datetime], [is_delete], [delete_datetime]) VALUES (1, N'Free', 0, NULL, CAST(N'2023-08-18T01:29:59.907' AS DateTime), 0, NULL)
INSERT [dbo].[plan_subscription] ([id], [name], [price], [duration], [create_datetime], [is_delete], [delete_datetime]) VALUES (2, N'Plus', 500, 12, CAST(N'2023-08-18T01:30:12.043' AS DateTime), 0, NULL)
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20230814120154_MyFirstMigration', N'6.0.19')
GO
SET IDENTITY_INSERT [dbo].[admin_account] ON 

INSERT [dbo].[admin_account] ([id], [name], [avatar], [username], [email], [password], [create_datetime], [is_delete], [delete_datetime]) VALUES (1, NULL, NULL, N'admin', NULL, N'admin', CAST(N'2023-08-18T01:29:19.180' AS DateTime), 0, NULL)
SET IDENTITY_INSERT [dbo].[admin_account] OFF
GO
