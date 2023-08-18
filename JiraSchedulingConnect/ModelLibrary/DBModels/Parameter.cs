﻿using System;
using System.Collections.Generic;

namespace ModelLibrary.DBModels
{
    public partial class Parameter
    {
        public Parameter()
        {
            ParameterResources = new HashSet<ParameterResource>();
            Schedules = new HashSet<Schedule>();
        }

        public int Id { get; set; }
        public int? ProjectId { get; set; }
        public int? Budget { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? Deadline { get; set; }
        public int? ObjectiveTime { get; set; }
        public int? ObjectiveCost { get; set; }
        public int? ObjectiveQuality { get; set; }
        public DateTime? CreateDatetime { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeleteDatetime { get; set; }
        public int? Optimizer { get; set; }

        public virtual Project? Project { get; set; }
        public virtual ICollection<ParameterResource> ParameterResources { get; set; }
        public virtual ICollection<Schedule> Schedules { get; set; }
    }
}
