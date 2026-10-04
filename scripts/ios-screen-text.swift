// CI helper: prints the text visible in a simulator screenshot (Apple Vision OCR),
// so the iOS workflow can assert that the app actually rendered its first screen.
import AppKit
import Vision

let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let image = NSImage(contentsOf: url),
  let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil)
else {
  FileHandle.standardError.write("Cannot read \(url.path)\n".data(using: .utf8)!)
  exit(2)
}
let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
try VNImageRequestHandler(cgImage: cgImage).perform([request])
for observation in request.results ?? [] {
  if let text = observation.topCandidates(1).first?.string { print(text) }
}
