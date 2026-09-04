import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else {
    fputs("Usage: rivo-ocr <image_path>\n", stderr)
    exit(1)
}

let imagePath = CommandLine.arguments[1]
let imageURL = URL(fileURLWithPath: imagePath)

guard let image = NSImage(contentsOf: imageURL),
      let tiffData = image.tiffRepresentation,
      let bitmapImage = NSBitmapImageRep(data: tiffData),
      let cgImage = bitmapImage.cgImage else {
    fputs("Error: Unable to load image at \(imagePath)\n", stderr)
    exit(1)
}

let request = VNRecognizeTextRequest { (request, error) in
    guard let observations = request.results as? [VNRecognizedTextObservation] else {
        return
    }
    let recognizedStrings = observations.compactMap { observation in
        observation.topCandidates(1).first?.string
    }
    print(recognizedStrings.joined(separator: "\n"))
}

request.recognitionLevel = .accurate
request.usesLanguageCorrection = true

let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
    try requestHandler.perform([request])
} catch {
    fputs("OCR Error: \(error.localizedDescription)\n", stderr)
    exit(1)
}
