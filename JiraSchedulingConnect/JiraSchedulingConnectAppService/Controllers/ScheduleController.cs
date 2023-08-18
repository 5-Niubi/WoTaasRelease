﻿using JiraSchedulingConnectAppService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ModelLibrary.DTOs;
using ModelLibrary.DTOs.Algorithm;

namespace JiraSchedulingConnectAppService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService scheduleService;
        private readonly ILoggerManager _Logger;
        public ScheduleController(IScheduleService scheduleService, ILoggerManager logger)
        {

            _Logger = logger;
            this.scheduleService = scheduleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSchedulesByProject(int projectId, int? page)
        {
            try
            {
                var response = await scheduleService.GetSchedulesByProject(projectId, page);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogDebug(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSchedules(int parameterId, int? page)
        {
            try
            {
                var response = await scheduleService.GetSchedules(parameterId, page);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogDebug(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSchedule(int scheduleId)
        {
            try
            {
                var response = await scheduleService.GetSchedule(scheduleId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogDebug(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSolution([FromBody] ScheduleRequestDTO scheduleRequestDTO)
        {
            try
            {
                var response = await scheduleService.SaveScheduleSolution(scheduleRequestDTO);
                return Ok(response);
            }

            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }


        [HttpDelete]
        public async Task<IActionResult> DeleteSolution(int solutionId)
        {
            try
            {
                var response = await scheduleService.Delete(solutionId);
                return Ok(response);
            }

            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateScheduleSolution([FromBody] ScheduleUpdatedRequestDTO scheduleRequestDTO)
        {
            try
            {
                var response = await scheduleService.UpdateScheduleSolution(scheduleRequestDTO);
                return Ok(response);
            }

            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);

                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }


        
    }
}
