using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class SegmentService : ISegmentService
    {
        private readonly ISegmentRepository _segmentRepository;

        public SegmentService(ISegmentRepository segmentRepository)
        {
            _segmentRepository = segmentRepository;
        }

        public async Task<IEnumerable<Segment>> GetAllSegmentsAsync()
        {
            return await _segmentRepository.GetAllAsync();
        }

        public async Task<Segment?> GetSegmentByIdAsync(int id)
        {
            return await _segmentRepository.GetByIdAsync(id);
        }

        public async Task<Segment> CreateSegmentAsync(Segment segment)
        {
            await _segmentRepository.AddAsync(segment);
            await _segmentRepository.SaveChangesAsync();
            return segment;
        }

        public async Task<Segment?> UpdateSegmentAsync(int id, Segment segment)
        {
            var existingSegment = await _segmentRepository.GetByIdAsync(id);

            if (existingSegment == null)
                return null;

            existingSegment.Name = segment.Name;
            existingSegment.Description = segment.Description;
            existingSegment.Capacity = segment.Capacity;
            existingSegment.SegmentType = segment.SegmentType;

            _segmentRepository.Update(existingSegment);
            await _segmentRepository.SaveChangesAsync();
            return existingSegment;
        }

        public async Task<bool> DeleteSegmentAsync(int id)
        {
            var segment = await _segmentRepository.GetByIdAsync(id);

            if (segment == null)
            {
                return false;
            }

            _segmentRepository.Delete(segment);
            await _segmentRepository.SaveChangesAsync();
            return true;
        }
    }
}
