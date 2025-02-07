import { CreationV2 } from '@edenlabs/eden-sdk'
import { createSlice } from '@reduxjs/toolkit'
import { isMobile } from 'react-device-detect'
import { toast } from 'sonner'

export interface DialogsState {
  quickUpscaleModal: {
    isOpen: boolean
    creation?: CreationV2
  }
  quickAnimateModal: {
    isOpen: boolean
    creation?: CreationV2
  }
  addToCollectionModal: {
    isOpen: boolean
    creationIds: string[]
  }
  createCollectionModal: {
    isOpen: boolean
  }
  shareDialog: {
    isOpen: boolean
    shareUrl?: string
  }
  deleteDialog: {
    isOpen: boolean
    title: string
    description: string
    onDelete: () => void
  }
}

const initialState: DialogsState = {
  quickUpscaleModal: {
    isOpen: false,
    creation: undefined,
  },
  quickAnimateModal: {
    isOpen: false,
    creation: undefined,
  },
  addToCollectionModal: {
    isOpen: false,
    creationIds: [],
  },
  createCollectionModal: {
    isOpen: false,
  },
  shareDialog: {
    isOpen: false,
    shareUrl: undefined,
  },
  deleteDialog: {
    isOpen: false,
    title: '',
    description: '',
    onDelete: () => {},
  },
}

const dialogsSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    closeAllQuickCreateModals(state) {
      state.quickAnimateModal.isOpen = false
      state.quickUpscaleModal.isOpen = false
    },
    updateQuickAnimateModal(
      state,
      action: { payload: { isOpen: boolean; creation?: CreationV2 } },
    ) {
      // console.log('toggleQuickAnimateModal', state, !state.quickAnimateModal.isOpen)
      state.quickAnimateModal.isOpen = action.payload.isOpen
      if (action.payload.creation) {
        state.quickAnimateModal.creation = action.payload.creation
      } else {
        state.quickAnimateModal.creation = undefined
      }
    },
    updateQuickUpscaleModal(
      state,
      action: { payload: { isOpen: boolean; creation?: CreationV2 } },
    ) {
      // console.log('toggleQuickAnimateModal', state, !state.quickAnimateModal.isOpen)
      state.quickUpscaleModal.isOpen = action.payload.isOpen
      if (action.payload.creation) {
        state.quickUpscaleModal.creation = action.payload.creation
      } else {
        state.quickUpscaleModal.creation = undefined
      }
    },
    updateAddToCollectionModal(
      state,
      action: { payload: { isOpen: boolean; creationIds?: string[] } },
    ) {
      state.addToCollectionModal.isOpen = action.payload.isOpen
      if (action.payload.creationIds) {
        state.addToCollectionModal.creationIds = action.payload.creationIds
      } else {
        state.addToCollectionModal.creationIds = []
      }
    },
    toggleCreateCollectionModal(state) {
      // console.log('toggleCreateCollectionModal', state, !state.createCollectionModal.isOpen)
      state.createCollectionModal.isOpen = !state.createCollectionModal.isOpen
    },
    updateShareModal(
      state,
      action: { payload: { isOpen: boolean; shareUrl?: string } },
    ) {
      if (!isMobile) {
        state.shareDialog.isOpen = action.payload.isOpen
        if (action.payload.shareUrl) {
          state.shareDialog.shareUrl = action.payload.shareUrl
        } else {
          state.shareDialog.shareUrl = undefined
        }
      } else {
        if (navigator && navigator.share) {
          navigator.share({
            title: 'Share',
            text: 'Check this on Eden',
            url: action.payload.shareUrl,
          })
          return
        }
        toast.info('Share not supported on this device', {
          description: 'Please copy the link to share',
          richColors: true,
          dismissible: true,
        })
      }
    },
    updateDeleteDialog(
      state,
      action: {
        payload: {
          isOpen?: boolean
          title?: string
          description?: string
          onDelete?: () => void
        }
      },
    ) {
      if (!action.payload.isOpen) {
        state.deleteDialog.isOpen = false
        state.deleteDialog.title = ''
        state.deleteDialog.description = ''
        state.deleteDialog.onDelete = () => {}
      } else {
        state.deleteDialog = {
          ...state.deleteDialog,
          ...action.payload,
        }
      }
    },
  },
})

export const {
  updateShareModal,
  updateQuickAnimateModal,
  updateQuickUpscaleModal,
  updateAddToCollectionModal,
  toggleCreateCollectionModal,
  updateDeleteDialog,
  closeAllQuickCreateModals,
} = dialogsSlice.actions

export default dialogsSlice.reducer
