import Image from "next/image";


export function Home(){
    return (
        <div className="flex items-center justify-center flex-col">
        <div className="flex flex-col lg:flex-row items-center lg:items-start p-40">
          <div className="flex flex-col items-center">
            <h1>Trellnode brings all your tasks, teammates, and tools together</h1>
          </div>
          <div>
            <Image
              src="/images/TrelloUICollage_4x.webp"
              width={500}
              height={500}
              alt="Trello UI Collage"
            />
          </div>
        </div>
      </div>
    )
}