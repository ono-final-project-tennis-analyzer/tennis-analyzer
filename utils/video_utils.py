import cv2
import torch


def get_video_properties(video):
    # Find OpenCV version
    (major_ver, minor_ver, subminor_ver) = (cv2.__version__).split('.')

    # get videos properties
    if int(major_ver) < 3:
        fps = video.get(cv2.cv.CV_CAP_PROP_FPS)
        length = int(video.get(cv2.cv.CAP_PROP_FRAME_COUNT))
        v_width = int(video.get(cv2.cv.CAP_PROP_FRAME_WIDTH))
        v_height = int(video.get(cv2.cv.CAP_PROP_FRAME_HEIGHT))
    else:
        fps = video.get(cv2.CAP_PROP_FPS)
        length = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        v_width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
        v_height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    return fps, length, v_width, v_height


def get_dtype():
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    device = torch.device(dev)
    if dev == 'cuda':
        dtype = torch.cuda.FloatTensor
    else:
        dtype = torch.FloatTensor
    print(f'Using device {device}')
    return dtype


def center_of_box(box):
    """
    Calculate the center of a box
    """
    if box[0] is None:
        return None, None
    height = box[3] - box[1]
    width = box[2] - box[0]
    return box[0] + width / 2, box[1] + height / 2


def frame_to_time(frame_number, fps):
    """
    Convert a frame number to a time string in the format HH:MM:SS.ms
    
    Args:
        frame_number (int): The frame number to convert
        fps (float): Frames per second of the video
        
    Returns:
        str: Time string in the format HH:MM:SS.ms
    """
    # Calculate total seconds
    total_seconds = frame_number / fps
    
    # Calculate hours, minutes, seconds and milliseconds
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    milliseconds = int((total_seconds - int(total_seconds)) * 1000)
    
    # Format the time string
    time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}.{milliseconds:03d}"
    
    return time_str


def frames_to_times(frame_indices_dict, fps):
    """
    Convert a dictionary of frame indices to time values
    
    Args:
        frame_indices_dict (dict): Dictionary with keys as event names and values as lists of frame indices
        fps (float): Frames per second of the video
        
    Returns:
        dict: Dictionary with keys as event names and values as lists of time strings
    """
    result = {}
    
    for event_name, frame_indices in frame_indices_dict.items():
        if isinstance(frame_indices, list):
            result[event_name] = [frame_to_time(frame, fps) for frame in frame_indices]
        else:
            # Handle case where value is a single frame number
            result[event_name] = frame_to_time(frame_indices, fps)
    
    return result
