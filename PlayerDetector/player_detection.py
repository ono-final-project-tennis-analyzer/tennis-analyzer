import torch
import torchvision.transforms as T
from PIL import Image
import matplotlib.pyplot as plt
from torchvision.models.detection import fasterrcnn_resnet50_fpn


class PlayerDetector:
    def __init__(self):
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.eval()
        self.transform = T.Compose([
            T.ToTensor()
        ])
    def detect(self, image_path):
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image)
        with torch.no_grad():
            predictions = self.model([image_tensor])
        return image, predictions
    def show_image_with_boxes(self, image, predictions, threshold=0.8, maxPlayers=2):
        plt.figure(figsize=(12, 8))
        plt.imshow(image)  # Make sure the image is in RGB
        ax = plt.gca()
        maxPlayers = maxPlayers
        players = 0
        for box, score, label in zip(predictions[0]['boxes'], predictions[0]['scores'], predictions[0]['labels']):
            if score > threshold and label == 1 and players < maxPlayers:  # Label 1 usually corresponds to person
                x1, y1, x2, y2 = box
                rect = plt.Rectangle((x1, y1), x2 - x1, y2 - y1, fill=False, color='red', linewidth=2)
                ax.add_patch(rect)
                ax.text(x1, y1, f'{score:.3f}', bbox=dict(facecolor='yellow', alpha=0.5))
                players += 1
        plt.axis('off')
        plt.show()


# Usage
detector = PlayerDetector()
#TODO: Add a path to an image
image_path = 'add a path to an image here'
image, predictions = detector.detect(image_path)
detector.show_image_with_boxes(image,predictions)
