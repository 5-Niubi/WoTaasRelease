﻿using ModelLibrary.DTOs.Thread;

namespace JiraSchedulingConnectAppService.Services.Interfaces
{
    public interface IThreadService
    {
        public ThreadModel GetThreadModel(string threadId);
        public string StartThread(string threadId, ThreadStart threadStart);
        public ThreadResultDTO GetThreadResult(string threadId);
    }
}
