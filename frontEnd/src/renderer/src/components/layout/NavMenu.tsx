import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@renderer/components/ui/menubar'
import { ReactElement } from 'react'

interface NavigationProps {
  radioItems: string[]
  selectedMode: string
  onModeChange: (mode: string) => void
  onDataTableToggle: () => void
  onDataUploadToggle: () => void
  onModelRunAlertToggle: () => void
  onLayerPageToggle: () => void
  handleTestAPIClick: () => void
}

export function NavMenu({
  radioItems = ['Dark', 'Light'],
  selectedMode = 'Dark',
  onModeChange,
  onDataTableToggle,
  onDataUploadToggle,
  onModelRunAlertToggle,
  onLayerPageToggle,
  handleTestAPIClick
}: NavigationProps): ReactElement {
  return (
    <Menubar className="top-0 w-full max-h-12 text-xl z-10">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Grid <MenubarShortcut>CRTL+T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Load Grid <MenubarShortcut>CRTL+G</MenubarShortcut>
          </MenubarItem>
          {/* <MenubarItem disabled>New Incognito Window</MenubarItem> */}
          <MenubarSeparator />
          {/* <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub> */}
          {/* <MenubarSeparator /> */}
          <MenubarItem>
            Save <MenubarShortcut>CRTL+S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>CRTL+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Redo <MenubarShortcut>CRTL+Y</MenubarShortcut>
          </MenubarItem>
          {/* <MenubarSeparator /> */}
          {/* <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem> */}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={selectedMode} onValueChange={onModeChange}>
            {radioItems.map((item) => (
              <MenubarRadioItem key={item} value={item}>
                {item}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem>
            Reload <MenubarShortcut>CRTL+R</MenubarShortcut>
          </MenubarItem>
          {/* <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>CRTL+⇧+R</MenubarShortcut>
          </MenubarItem> */}
          <MenubarSeparator />
          <MenubarItem>
            Toggle Fullscreen <MenubarShortcut>F12</MenubarShortcut>
            </MenubarItem>
          <MenubarSeparator />
          {/* <MenubarItem inset>Hide Sidebar</MenubarItem> */}
          <MenubarItem>
            Show 3DTile <MenubarShortcut>CRTL+T</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      {/* <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu> */}
      <MenubarMenu>
        <MenubarTrigger>Data</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onDataTableToggle}>
            Data Table <MenubarShortcut>CRTL+T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onDataUploadToggle}>
            Data Upload <MenubarShortcut>CRTL+U</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onLayerPageToggle}>
            Layer Page <MenubarShortcut>CRTL+L</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Model</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onModelRunAlertToggle}>
            Run Model <MenubarShortcut>CRTL+F5</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Result</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Show Result <MenubarShortcut>CRTL+D</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Test</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleTestAPIClick}>
            Test API <MenubarShortcut>CRTL+T</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
